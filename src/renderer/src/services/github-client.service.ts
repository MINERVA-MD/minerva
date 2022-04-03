import type { GitRepo } from '../../../typings/GitService';
import type IGitClientService from '../Interfaces/IGitClientService';

export default class GithubClientService implements IGitClientService {
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
		try {
			this.userRepositories = await window.ipcRenderer.invoke(
				'get-repo-list',
				this.username,
			);
		} catch (error) {
			console.log(error);
		}

		return this.userRepositories;
	}

	// eslint-disable-next-line class-methods-use-this
	async authorize() {
		await window.ipcRenderer.invoke('github-oauth', 'getToken');
		const repos = await this.getRepoList();
		console.log(JSON.stringify(repos, null, 4));
	}

	async cloneSelectedRepo() {
		await window.ipcRenderer.invoke('clone-repo', this.repo);
	}

	async getReadMeContents() {
		const fileContents = await window.ipcRenderer.invoke(
			'get-file-content',
			this.repo,
		);
		return fileContents;
	}
}
