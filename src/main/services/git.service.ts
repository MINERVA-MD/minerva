/* eslint-disable class-methods-use-this */
import fs, { chownSync } from 'fs';
import simpleGit from 'simple-git';
import { Octokit } from '@octokit/core';
import { app, ipcMain, BrowserWindow } from 'electron';

import type { GitRepo } from '@/typings/GitService';
import { GitHubOAuth } from '../../common/config/auth.config';
import { MINERVA_DIR, SECRETS_PATH } from '../../common/utils/secrets.util';

export default class GitService {
	private token = '';

	private username = '';

	private localRepoPath = '';

	private remote = '';

	private octokit: Octokit | null = null;

	constructor(username: string, token: string) {
		console.log('Instantiating new Github Service');
		this.localRepoPath = `${app.getPath('documents')}/Minerva/repos`;
		this.username = username;
		this.token = token;
		this.saveSecret('Username', username);
		this.listen();
	}

	// TODO: Refactor into utility static class
	// TODO: Refactor so that file paths are saved as constants
	private saveSecret = (key: string, value: string): void => {
		this.createSecretsFileIfNotExists();
		try {
			// Read current contents from file
			const secretsJSON = JSON.parse(
				fs.readFileSync(SECRETS_PATH, { encoding: 'utf8' }),
			);

			// (Over) write key with value
			secretsJSON[key] = value;

			fs.writeFileSync(
				SECRETS_PATH,
				JSON.stringify(secretsJSON, null, 4),
				{ encoding: 'utf8' },
			);
		} catch (e) {
			console.log(e);
		}
	};

	private getSecret = (key: string): string => {
		const secretsJSON = JSON.parse(
			fs.readFileSync(SECRETS_PATH, { encoding: 'utf8' }),
		);
		return secretsJSON[key] || '';
	};

	private isSecretStored = (key: string): boolean => {
		const secretsJSON = JSON.parse(
			fs.readFileSync(SECRETS_PATH, { encoding: 'utf8' }),
		);
		if (secretsJSON[key] === '') {
			return false;
		}

		return key in secretsJSON;
	};

	private clearSecrets() {
		fs.writeFileSync(SECRETS_PATH, '{}');
	}

	private async clearSessionData() {
		console.log('session clear');
		const win = BrowserWindow.getAllWindows();

		const { session } = win[0].webContents;
		try {
			await session.clearAuthCache();
			await session.clearStorageData();
			await session.clearCache();
			await session.clearHostResolverCache();
		} catch (error) {
			console.log(error);
		}
	}

	// listen for git service on connect and modify api endpoints accordingly
	listen() {
		ipcMain.handle('get-repo-list', async () => {
			try {
				const repos: GitRepo[] = await this.getAllUserRepos();
				return repos;
			} catch (error) {
				console.log(error);
			}
			return [];
		});

		ipcMain.handle('clone-repo', async (event, repo: string) => {
			const repoObj: GitRepo = JSON.parse(repo);
			console.log(repoObj);
			// prettier-ignore
			const remote = `https://${this.getSecret('GH_OAUTH_TOKEN')}@github.com/${repoObj.ownerLogin}/${repoObj.name}.git`;
			this.remote = remote;
			await simpleGit()
				.clone(remote, `${this.localRepoPath}/${repoObj.name}`)
				.catch(e => console.log(e));
		});

		ipcMain.handle(
			'get-file-content',
			async (event, repoName: string, fileName = 'README.md') => {
				try {
					if (
						fs.existsSync(
							`${this.localRepoPath}/${repoName}/${fileName}`,
						)
					) {
						const fileData = await fs.promises.readFile(
							`${this.localRepoPath}/${repoName}/${fileName}`,
							'utf8',
						);
						return fileData;
					}
					fs.writeFileSync(
						`${this.localRepoPath}/${repoName}/${fileName}`,
						'## No ReadMe Found in Repo \n *Readme created by minerva*',
					);

					const fileData = await fs.promises.readFile(
						`${this.localRepoPath}/${repoName}/${fileName}`,
						'utf8',
					);
					return fileData;
				} catch (error) {
					console.log(error);
					return error;
				}
			},
		);

		ipcMain.handle(
			'commit-changes',
			async (event, repoName, fileName, editorText) => {
				try {
					await fs.promises.writeFile(
						`${this.localRepoPath}/${repoName}/${fileName}`,
						editorText,
					);
					await this.commitAndPush(repoName);
					return 'success';
				} catch (error) {
					return error;
				}
			},
		);

		ipcMain.handle('github-oauth', async () => {
			try {
				await this.generateOAuthToken();
				return this.authenticateUser();
			} catch (error) {
				console.log(error);
				return error;
			}
		});

		ipcMain.handle('logout', async () => {
			this.destroy();
			await this.clearSessionData();
			// this.clearSecrets();
		});
	}

	async generateOAuthToken() {
		try {
			if (!this.isSecretStored('GH_OAUTH_TOKEN')) {
				const token = await GitHubOAuth.getAccessToken({
					scope: 'repo',
				});
				this.saveSecret('GH_OAUTH_TOKEN_SCOPE', token.scope);
				this.saveSecret('GH_OAUTH_TOKEN', token.access_token);
				this.saveSecret('GH_OAUTH_TOKEN_TYPE', token.token_type);
			}
		} catch (err) {
			console.log('Error while getting token', err);
		}
	}

	async authenticateUser() {
		this.octokit = new Octokit({
			auth: this.getSecret('GH_OAUTH_TOKEN'),
		});

		const { data } = await this.octokit.request('GET /user');
		this.username = data.login;
		this.saveSecret('Username', data.login);

		return { username: data.login, avatarUrl: data.avatar_url };
	}

	async getAllUserRepos(): Promise<GitRepo[]> {
		const ghRepos: GitRepo[] = [];
		try {
			if (this.octokit) {
				const { data: repos } = await this.octokit.request(
					`GET /user/repos`,
					{ per_page: 100 },
				);
				// eslint-disable-next-line no-restricted-syntax
				for (const repo of repos) {
					ghRepos.push({
						id: repo.id,
						ownerLogin: repo.owner.login,
						name: repo.name,
						cloneUrl: repo.clone_url,
						isPrivate: repo.private,
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
		return ghRepos;
	}

	createSecretsFileIfNotExists() {
		// Create Dir if it does not exist
		if (!fs.existsSync(MINERVA_DIR)) {
			fs.mkdirSync(MINERVA_DIR);
		}
		if (!fs.existsSync(SECRETS_PATH)) {
			fs.openSync(SECRETS_PATH, 'w');
			fs.writeFileSync(SECRETS_PATH, JSON.stringify({}));
		}
	}

	async commitAndPush(repoName: string) {
		try {
			await simpleGit()
				.cwd(`${this.localRepoPath}/${repoName}`)
				.add('./*')
				.commit('committed from Minerva!')
				.push(['-u', this.remote, 'main'], () => {
					console.log('successfully pushed');
				});
		} catch (error) {
			console.log(error);
		}
	}

	destroy() {
		ipcMain.removeHandler('clone-repo');
		ipcMain.removeHandler('commit-changes');
		ipcMain.removeHandler('get-repo-list');
		ipcMain.removeHandler('get-file-content');
		ipcMain.removeHandler('github-oauth');
		ipcMain.removeHandler('logout');
	}
}
