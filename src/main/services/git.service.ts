import dotenv from 'dotenv';
import { ipcMain } from 'electron';
import axios from 'axios';

dotenv.config();
export default class GitService {
	constructor() {
		this.listen();
	}

	listen() {
		ipcMain.on('github-connect', (event, data) => {
			console.log(this.getAllUserRepos('testminerva'));
		});
	}

	async getAllUserRepos(username: string) {
		const repos = [];

		// GitHub endpoint, dynamically passing in specified username
		const url = `https://api.github.com/users/${username}/repos`;

		// Open a new connection, using a GET request via URL endpoint
		// Providing 3 arguments (GET/POST, The URL, Async True/False)
		const response = await axios.get(url);
		const data = await response.data;
		data.forEach((item: any) => {
			repos.push(item);
		});
		console.log(repos);
	}
}
