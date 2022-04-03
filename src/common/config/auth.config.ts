// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import electronOauth2 from 'electron-oauth2';

import { getSecret } from '../utils/vault.util';

/**
 *     const keytar = require('keytar')
 *
 *     // Creates a secret
 *     keytar.setPassword('MyAppName', 'AccountName', 'secret');
 *
 *     // Reads the secret
 *     const secret = keytar.getPassword('MyAppName', 'AccountName');
 */

export const AUTH_WINDOWS_PARAMS = {
	alwaysOnTop: true,
	autoHideMenuBar: true,
	webPreferences: {
		nodeIntegration: false,
	},
};

export const OAUTH_CONFIG = {
	clientId: getSecret('clientId'),
	clientSecret: getSecret('clientSecret'),
	authorizationUrl: 'http://github.com/login/oauth/authorize',
	tokenUrl: 'https://github.com/login/oauth/access_token',
	useBasicAuthorizationHeader: false,
	redirectUri: 'http://localhost',
};

// TODO: REFACTOR to re-implement electronOauth2 - node-fetch has vulnerabilities
export const GitHubOAuth = electronOauth2(OAUTH_CONFIG, AUTH_WINDOWS_PARAMS);
