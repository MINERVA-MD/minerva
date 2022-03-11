import dotenv from 'dotenv';
import { ipcMain } from 'electron';
import axios from 'axios';
import type { GitRepo } from '@/typings/GitService';

dotenv.config();
export default class GitService {
	username = '';

	constructor(username: string) {
		this.username = username;
		this.listen();
	}

	// listen for git service on connect and modify api endpoints
	// accordingly
	listen() {
		ipcMain.handle('get-repo-list', async (event, username: string) => {
			const repos: GitRepo[] = await this.getAllUserRepos();
			return repos;
		});
		ipcMain.on('get-repo-content', async (event, repoUrl) => {
			const response = await axios.get(repoUrl);
			const data = await response.data;
			event.reply('repo-content', data);
		});
	}

	async getAllUserRepos(): Promise<GitRepo[]> {
		const repos: GitRepo[] = [];

		const url = `https://api.github.com/users/${this.username}/repos`;

		const response = await axios.get(url);
		const data = await response.data;
		await data.forEach((item: any) => {
			console.log(item);
			repos.push({ name: item.name, cloneUrl: item.clone_url });
		});
		return repos;
	}
}
