/* eslint-disable class-methods-use-this */
import fs from 'fs';
import simpleGit from 'simple-git';
import { Octokit } from '@octokit/core';
import { app, ipcMain, BrowserWindow } from 'electron';
import type { GitRepo } from '@/types/GitService';

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
			await this.cloneRepo(repoObj);
		});

		ipcMain.handle(
			'get-file-content',
			async (event, repoName: string, fileName = 'README.md') => {
				return this.getFileContents(repoName, fileName);
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
					return await this.commitAndPush(repoName);
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

		ipcMain.handle(
			'use-template',
			async (event, md: string, repoName: string) => {
				return this.useTemplate(md, repoName);
			},
		);
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
						avatar: repo.owner.avatar_url,
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

	async cloneRepo(repoObj: GitRepo) {
		const remote = `https://${this.getSecret(
			'GH_OAUTH_TOKEN',
		)}@github.com/${repoObj.ownerLogin}/${repoObj.name}.git`;
		this.remote = remote;

		if (fs.existsSync(`${this.localRepoPath}/${repoObj.name}`)) {
			fs.rmSync(`${this.localRepoPath}/${repoObj.name}`, {
				recursive: true,
				force: true,
			});
		}
		await simpleGit()
			.clone(remote, `${this.localRepoPath}/${repoObj.name}`)
			.catch(e => console.log(e));
	}

	async getFileContents(repoName: string, fileName = 'README.md') {
		try {
			if (
				fs.existsSync(`${this.localRepoPath}/${repoName}/${fileName}`)
			) {
				const fileData = await fs.promises.readFile(
					`${this.localRepoPath}/${repoName}/${fileName}`,
					'utf8',
				);
				return fileData;
			}

			throw new Error(`The repo ${repoName} doesn't contain a README`);
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	async useTemplate(md: string, repoName: string) {
		try {
			fs.writeFileSync(`${this.localRepoPath}/${repoName}/README.md`, md);
			return await fs.promises.readFile(
				`${this.localRepoPath}/${repoName}/README.md`,
				'utf8',
			);
		} catch (error) {
			return error;
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
			return true;
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	destroy() {
		ipcMain.removeHandler('clone-repo');
		ipcMain.removeHandler('commit-changes');
		ipcMain.removeHandler('get-repo-list');
		ipcMain.removeHandler('get-file-content');
		ipcMain.removeHandler('github-oauth');
		ipcMain.removeHandler('logout');
		ipcMain.removeHandler('use-template');
	}
}
