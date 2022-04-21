import os from 'os';
// import url from 'url';
// import axios from 'axios';
// import keytar from 'keytar';
// import jwtDecode from 'jwt-decode';
//
// import envVariables from '../../../env-variables.json';
//
// const { apiIdentifier, auth0Domain, clientId } = envVariables;
//
// const redirectUri = 'http://localhost/callback';
//
// const keytarService = 'electron-openid-oauth';
// const keytarAccount = os.userInfo().username;
//
// let accessToken = null;
// let profile = null;
// let refreshToken = null;
//
// export function getAccessToken() {
// 	return accessToken;
// }
//
// export function getProfile() {
// 	return profile;
// }
//
// export function getAuthenticationURL() {
// 	return (
// 		`https://${auth0Domain}/authorize?` +
// 		`scope=openid profile offline_access&` +
// 		`response_type=code&` +
// 		`client_id=${clientId}&` +
// 		`redirect_uri=${redirectUri}`
// 	);
// }
//
// export async function refreshTokens() {
// 	const refreshToken = await keytar.getPassword(keytarService, keytarAccount);
//
// 	if (refreshToken) {
// 		const refreshOptions = {
// 			method: "POST",
// 			url: `https://${auth0Domain}/oauth/token`,
// 			headers: { "content-type": "application/json" },
// 			data: {
// 				grant_type: "refresh_token",
// 				client_id: clientId,
// 				refresh_token: refreshToken,
// 			},
// 		};
//
// 		try {
// 			const response = await axios(refreshOptions);
//
// 			accessToken = response.data.access_token;
// 			profile = jwtDecode(response.data.id_token);
// 		} catch (error) {
// 			await logout();
//
// 			throw error;
// 		}
// 	} else {
// 		throw new Error("No available refresh token.");
// 	}
// }
//
// export async function loadTokens(callbackURL) {
// 	const urlParts = url.parse(callbackURL, true);
// 	const query = urlParts.query;
//
// 	const exchangeOptions = {
// 		grant_type: "authorization_code",
// 		client_id: clientId,
// 		code: query.code,
// 		redirect_uri: redirectUri,
// 	};
//
// 	const options = {
// 		method: "POST",
// 		url: `https://${auth0Domain}/oauth/token`,
// 		headers: {
// 			"content-type": "application/json",
// 		},
// 		data: JSON.stringify(exchangeOptions),
// 	};
//
// 	try {
// 		const response = await axios(options);
//
// 		accessToken = response.data.access_token;
// 		profile = jwtDecode(response.data.id_token);
// 		refreshToken = response.data.refresh_token;
//
// 		if (refreshToken) {
// 			await keytar.setPassword(keytarService, keytarAccount, refreshToken);
// 		}
// 	} catch (error) {
// 		await logout();
//
// 		throw error;
// 	}
// }
//
// export async function logout() {
// 	await keytar.deletePassword(keytarService, keytarAccount);
// 	accessToken = null;
// 	profile = null;
// 	refreshToken = null;
// }
//
// export function getLogOutUrl() {
// 	return `https://${auth0Domain}/v2/logout`;
// }
