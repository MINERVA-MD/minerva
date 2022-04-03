/* eslint-disable class-methods-use-this */
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { Octokit } from '@octokit/core';
import { app, ipcMain } from 'electron';

import type { GitRepo } from '@/typings/GitService';
import { GitHubOAuth } from '../../common/config/auth.config';
import { MINERVA_DIR, SECRETS_PATH } from '../../common/utils/secrets.util';

export default class GitService {
	private token = '';

	private username = '';

	private localRepoPath = '';

	private remote = '';

	constructor(username: string, token: string) {
		console.log('Instantiating new Github Service');
		this.localRepoPath = path.join(
			app.getPath('documents'),
			'minerva_repos',
		);

		this.username = username;
		this.saveSecret('Username', username);
		this.listen();
	}

	// TODO: Refactor into utility static class
	// TODO: Refactor so that file paths are saved as constants
	private saveSecret = (key: string, value: string): void => {
		try {
			// Create Dir if it does not exist
			if (!fs.existsSync(MINERVA_DIR)) {
				fs.mkdirSync(MINERVA_DIR);
				fs.writeFileSync(SECRETS_PATH, JSON.stringify({}));
			}

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
		return key in secretsJSON;
	};

	// listen for git service on connect and modify api endpoints accordingly
	listen() {
		ipcMain.handle('get-repo-list', async (event, username: string) => {
			const repos: GitRepo[] = await this.getAllUserRepos();
			return repos;
		});

		ipcMain.handle('clone-repo', async (event, repoName: string) => {
			// await this.checkPathExists();
			const remote = `https://${this.getSecret(
				'GH_OAUTH_TOKEN',
			)}@github.com/${this.username}/${repoName}.git`;
			this.remote = remote;
			await simpleGit()
				.clone(remote, `${this.localRepoPath}/${repoName}`)
				.catch(e => console.log(e));
		});

		ipcMain.handle(
			'get-file-content',
			async (event, repoName: string, fileName = 'README.md') => {
				try {
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

		ipcMain.handle('github-oauth', async (event, arg) => {
			await this.generateOAuthToken();
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

	async getAllUserRepos(): Promise<GitRepo[]> {
		const repos: GitRepo[] = [];

		await this.generateOAuthToken();

		const octokit = new Octokit({
			auth: this.getSecret('GH_OAUTH_TOKEN'),
		});

		const { data } = await octokit.request(`GET /user/repos`);

		// eslint-disable-next-line no-restricted-syntax
		for (const repo of data) {
			repos.push({
				id: repo.id,
				name: repo.name,
				cloneUrl: repo.clone_url,
				isPrivate: repo.private,
			});
		}
		return repos;
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
}
