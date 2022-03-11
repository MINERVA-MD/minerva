/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { ipcMain, app } from 'electron';
import axios from 'axios';
import type { GitRepo } from '@/typings/GitService';
import simpleGit from 'simple-git';
import fs from 'fs';

dotenv.config();
export default class GitService {
	token = '';

	username = '';

	localRepoPath = '';

	constructor(username: string, token: string) {
		this.localRepoPath = `${app.getPath('documents')}/minerva_repos`;
		this.username = username;
		this.token = token;
		this.listen();
	}

	// listen for git service on connect and modify api endpoints
	// accordingly
	listen() {
		ipcMain.handle('get-repo-list', async (event, username: string) => {
			const repos: GitRepo[] = await this.getAllUserRepos();
			return repos;
		});

		ipcMain.handle('clone-repo', async (event, repoName: string) => {
			// await this.checkPathExists();
			const remote = `https://${this.token}@github.com/${this.username}/${repoName}.git`;
			await simpleGit()
				.clone(remote, `${this.localRepoPath}/${repoName}`)
				.catch(e => console.log(e));
		});

		ipcMain.handle(
			'get-file-content',
			async (event, repoName: string, fileName = 'README.md') => {
				const fileData = await fs.promises.readFile(
					`${this.localRepoPath}/${repoName}/${fileName}`,
					'utf8',
				);
				return fileData;
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
					await this.commitAndPush();
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

	async commitAndPush() {
		try {
			await simpleGit()
				.add('./*')
				.commit('committed from Minerva!')
				.push(['-u', 'origin', 'main'], () => {
					console.log('successfully pushed');
				});
		} catch (error) {
			console.log(error);
		}
	}
}
