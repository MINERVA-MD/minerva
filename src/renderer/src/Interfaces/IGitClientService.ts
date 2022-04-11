import type { GitRepo } from '@/typings/GitService';

export default interface IGitClientService {
	username: string;
	avatarUrl: string;
	repo: string;
	token: string;
	userRepositories: GitRepo[];
	getRepoList: () => Promise<GitRepo[]>;
	cloneSelectedRepo: () => void;
	getReadMeContents: () => Promise<string>;
}
