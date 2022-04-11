import type { GitRepo } from '../../../typings/GitService';
import type IGitClientService from '../Interfaces/IGitClientService';

export default class GithubClientService implements IGitClientService {
	username = '';

	avatarUrl = '';

	repo = '';

	token = '';

	userRepositories: GitRepo[] = [];

	constructor() {
<<<<<<< HEAD
		this.username = '';
		this.repo = '';
		this.token = '';
=======
>>>>>>> 3ac343903683bf0f0f9545c9c67c86a4c90547e1
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

	async authorize() {
<<<<<<< HEAD
		await window.ipcRenderer.invoke('github-oauth');
=======
		const userData = await window.ipcRenderer.invoke('github-oauth');
		console.log(userData);
		this.username = userData.username;
		this.avatarUrl = userData.avatarUrl;

>>>>>>> 3ac343903683bf0f0f9545c9c67c86a4c90547e1
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
