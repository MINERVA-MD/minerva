import type { GitRepo } from '../../../typings/GitService';
import type IGitClientService from '../Interfaces/IGitClientService';

export default class GithubClientService /* implements IGitClientService */ {
	username: string;

	repositories: GitRepo[] = [];

	constructor(username: string) {
		this.username = username;
		window.ipcRenderer.send('github-connect', this.username);
	}

	async getRepoList(): Promise<GitRepo[]> {
		this.repositories = await window.ipcRenderer.invoke(
			'get-repo-list',
			this.username,
		);

		return this.repositories;
	}
}
