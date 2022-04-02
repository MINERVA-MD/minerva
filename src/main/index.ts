import { release } from 'os';
import { join } from 'path';
import { app, ipcMain, BrowserWindow, shell } from 'electron';

import GitService from './services/git.service';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

let win: BrowserWindow | null = null;

async function createWindow() {
	win = new BrowserWindow({
		width: 1400,
		height: 900,
		title: 'Main window',
		// titleBarStyle: 'hidden',
		webPreferences: {
			preload: join(__dirname, '../preload/index.cjs'),
		},
		autoHideMenuBar: true,
	});

	if (app.isPackaged) {
		win.loadFile(join(__dirname, '../renderer/index.html'));
	} else {
		// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
		const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

		win.loadURL(url);
		win.webContents.openDevTools();
	}

	// Test active push message to Renderer-process
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send(
			'main-process-message',
			new Date().toLocaleString(),
		);
	});

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	win = null;
	if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

let gitService: GitService | null = null;
ipcMain.on('github-connect', (event, username, token) => {
	// eslint-disable-next-line no-new
	if (gitService) {
		gitService.destroy();
		gitService = null;
		gitService = new GitService(username, token);
	} else {
		gitService = new GitService(username, token);
	}
});
