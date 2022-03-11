import type { GitRepo } from '@/typings/GitService';

export default interface IGitClientService {
	username: string;
	repositories: GitRepo[];
	getRepoList: () => Promise<GitRepo[]>;
}
