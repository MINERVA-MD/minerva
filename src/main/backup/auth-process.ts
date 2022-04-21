import { BrowserWindow } from 'electron';

// import { createWindow } from '../app-process';
// import {
// 	getAuthenticationURL,
// 	getLogOutUrl,
// 	loadTokens,
// 	logout,
// } from './auth-service';
//
// let win = null;
//
// function destroyAuthWin() {
// 	if (!win) return;
// 	win.close();
// 	win = null;
// }
//
// export function createAuthWindow() {
// 	destroyAuthWin();
//
// 	win = new BrowserWindow({
// 		width: 1000,
// 		height: 600,
// 		webPreferences: {
// 			nodeIntegration: false,
// 		},
// 	});
//
// 	win.loadURL(getAuthenticationURL());
//
// 	const { session: {webRequest} } = win.webContents;
//
// 	const filter = {
// 		urls: ['http://localhost/callback*'],
// 	};
//
// 	webRequest.onBeforeRequest(filter, async ({ url }) => {
// 		await loadTokens(url);
// 		createWindow();
// 		return destroyAuthWin();
// 	});
//
// 	win.on('authenticated', () => {
// 		destroyAuthWin();
// 	});
//
// 	win.on('closed', () => {
// 		win = null;
// 	});
// }
//
// export function createLogoutWindow() {
// 	const logoutWindow = new BrowserWindow({
// 		show: false,
// 	});
//
// 	logoutWindow.loadURL(getLogOutUrl());
//
// 	logoutWindow.on('ready-to-show', async () => {
// 		logoutWindow.close();
// 		await logout();
// 	});
// }
