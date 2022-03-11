import type { GitRepo } from '../../../typings/GitService';
// import type IGitClientService from '../Interfaces/IGitClientService';

export default class GithubClientService /* implements IGitClientService */ {
	username: string;

	repo: string;

	token: string;

	userRepositories: GitRepo[] = [];

	constructor(username: string, token: string) {
		this.username = username;
		this.repo = '';
		this.token = token;
		window.ipcRenderer.send('github-connect', this.username, this.token);
	}

	async getRepoList(): Promise<GitRepo[]> {
		this.userRepositories = await window.ipcRenderer.invoke(
			'get-repo-list',
			this.username,
		);

		return this.userRepositories;
	}
}
