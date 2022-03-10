import type { GitRepo } from '../../../typings/GitService';
import type IGitClientService from '../Interfaces/IGitClientService';

export default class GithubClientService implements IGitClientService {
	username: string;

	repositories: GitRepo[] = [];

	constructor(username: string) {
		this.username = username;
		this.getRepos();
	}

	getRepos(): void {
		window.ipcRenderer.send('github-connect', this.username);
	}

	getRepoContent(repoUrl: string) {
		window.ipcRenderer.send('get-repo-content', repoUrl);
	}
}
