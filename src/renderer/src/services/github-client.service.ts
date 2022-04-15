import type { GitRepo } from '../../../typings/GitService';
import type IGitClientService from '../Interfaces/IGitClientService';

export default class GithubClientService implements IGitClientService {
	username = '';

	avatarUrl = '';

	repo: GitRepo | null = null;

	token = '';

	userRepositories: GitRepo[] = [];

	constructor() {
		window.ipcRenderer.send('github-connect', this.username, this.token);
	}

	async getRepoList(): Promise<GitRepo[]> {
		try {
			this.userRepositories = await window.ipcRenderer.invoke(
				'get-repo-list',
			);
		} catch (error) {
			console.log(error);
		}

		return this.userRepositories;
	}

	async authorize() {
		const userData = await window.ipcRenderer.invoke('github-oauth');
		this.username = userData.username;
		this.avatarUrl = userData.avatarUrl;

		await this.getRepoList();
	}

	// eslint-disable-next-line class-methods-use-this
	async logout() {
		await window.ipcRenderer.invoke('logout');
	}

	async cloneSelectedRepo() {
		try {
			await window.ipcRenderer.invoke('clone-repo', this.repo?.name);
		} catch (error) {
			console.log(error);
		}
	}

	async getReadMeContents() {
		const fileContents = await window.ipcRenderer.invoke(
			'get-file-content',
			this.repo?.name,
		);
		return fileContents;
	}

	clearRepo() {
		this.repo = null;
	}
}
