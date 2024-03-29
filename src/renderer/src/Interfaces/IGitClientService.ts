import type { GitRepo } from '@/types/GitService';

export default interface IGitClientService {
	username: string;
	avatarUrl: string;
	repo: GitRepo | null;
	token: string;
	userRepositories: GitRepo[];
	getRepoList: () => Promise<GitRepo[]>;
	cloneSelectedRepo: () => void;
	getReadMeContents: () => Promise<string>;
	clearRepo: () => void;
}
