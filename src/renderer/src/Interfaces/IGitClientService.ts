import type { GitRepo } from '@/typings/GitService';

export default interface IGitClientService {
	username: string;
	userRepositories: GitRepo[];
	getRepoList: () => Promise<GitRepo[]>;
}
