/* eslint-disable class-methods-use-this */
import fs from 'fs';
import axios from 'axios';
import assert from 'assert';
import dotenv from 'dotenv';
import simpleGit from 'simple-git';
import { ipcMain, app } from 'electron';

import type { GitRepo } from '@/typings/GitService';

dotenv.config();
export default class GitService {
	private token = '';

	private username = '';

	private localRepoPath = '';

	private remote = '';

	constructor(username: string, token: string) {
		console.log('Instantiating new Github Service');
		this.localRepoPath = `${app.getPath('documents')}/minerva_repos`;
		this.username = username;
		this.token = token;
		this.saveTokenAsEnv(token);
		this.listen();
	}

	// TODO: Refactor into utility static class
	private saveTokenAsEnv = (token: string): void => {
		const envPath = './.env';
		if (!this.isProcessEnvSet('GH_PAT')) {
			console.log('Attempting to save token');
			if (!fs.existsSync(envPath)) {
				// Create gh.pat.env in curr folder if it does not exist
				fs.closeSync(fs.openSync(envPath, 'w'));
			}
			fs.appendFileSync(envPath, 'GH_PAT=token');
			dotenv.config();
		}
		assert(this.isProcessEnvSet('GH_PAT'), 'GitHub PAT should be set.');
	};

	private isProcessEnvSet = (key: string): boolean => {
		return key in process.env;
	};

	// listen for git service on connect and modify api endpoints accordingly
	listen() {
		ipcMain.handle('get-repo-list', async (event, username: string) => {
			const repos: GitRepo[] = await this.getAllUserRepos();
			return repos;
		});

		ipcMain.handle('clone-repo', async (event, repoName: string) => {
			// await this.checkPathExists();
			const remote = `https://${process.env.GH_PAT}@github.com/${this.username}/${repoName}.git`;
			this.remote = remote;
			await simpleGit()
				.clone(remote, `${this.localRepoPath}/${repoName}`)
				.catch(e => console.log(e));
		});

		ipcMain.handle(
			'get-file-content',
			async (event, repoName: string, fileName = 'README.md') => {
				try {
					const fileData = await fs.promises.readFile(
						`${this.localRepoPath}/${repoName}/${fileName}`,
						'utf8',
					);
					return fileData;
				} catch (error) {
					console.log(error);
					return error;
				}
			},
		);

		ipcMain.handle(
			'commit-changes',
			async (event, repoName, fileName, editorText) => {
				try {
					await fs.promises.writeFile(
						`${this.localRepoPath}/${repoName}/${fileName}`,
						editorText,
					);
					await this.commitAndPush(repoName);
					return 'success';
				} catch (error) {
					return error;
				}
			},
		);
	}
	//	getFileContents(repoName: string, fileName: string) {}

	async getAllUserRepos(): Promise<GitRepo[]> {
		const repos: GitRepo[] = [];

		const url = `https://api.github.com/users/${this.username}/repos`;

		const response = await axios.get(url);
		const data = await response.data;
		await data.forEach((item: any) => {
			repos.push({ name: item.name, cloneUrl: item.clone_url });
		});
		return repos;
	}

	async commitAndPush(repoName: string) {
		try {
			await simpleGit()
				.cwd(`${this.localRepoPath}/${repoName}`)
				.add('./*')
				.commit('committed from Minerva!')
				.push(['-u', this.remote, 'main'], () => {
					console.log('successfully pushed');
				});
		} catch (error) {
			console.log(error);
		}
	}
}
