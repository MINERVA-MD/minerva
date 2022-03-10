import type { GitRepo } from '@/typings/GitService';

export default interface IGitClientService {
	username: string;
	repositories: GitRepo[];
	getRepos: () => void;
	getRepoContent: (repoUrl: string) => void;
}
