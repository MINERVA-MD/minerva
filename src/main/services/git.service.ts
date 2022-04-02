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
		this.listen();
	}

	// listen for git service on connect and modify api endpoints accordingly
	listen() {
		ipcMain.handle('get-repo-list', async (event, username: string) => {
			try {
				const repos: GitRepo[] = await this.getAllUserRepos();
				return repos;
			} catch (error) {
				console.log(error);
			}
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

		try {
			const response = await axios.get(url);
			const data = await response.data;
			await data.forEach((item: any) => {
				repos.push({ name: item.name, cloneUrl: item.clone_url });
			});
		} catch (error) {
			console.log(error);
		}
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

	destroy() {
		ipcMain.removeHandler('clone-repo');
		ipcMain.removeHandler('commit-changes');
		ipcMain.removeHandler('get-repo-list');
		ipcMain.removeHandler('get-file-content');
	}
}
