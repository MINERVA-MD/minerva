/* eslint-disable import/no-mutable-exports */

import { join } from 'path';
import { release } from 'os';
import { BrowserWindow, ipcMain, shell, app, Menu } from 'electron';

import GitService from './services/git.service';
import FileHandle from './services/fileHandle.service';
import Preferences from './services/preferences';

// TODO: MM - clean up config, refactor in to separate config files

const icon = app.isPackaged
	? join(__dirname, '..', 'common', 'assets', 'logo24x24.ico')
	: join(__dirname, '..', '..', 'src', 'common', 'assets', 'logo24x24.ico');

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());
const isMac = process.platform === 'darwin';
let macOpenFile: string;

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

let win: BrowserWindow | null = null;
let splash: BrowserWindow | null = null;

async function createWindow() {
	win = new BrowserWindow({
		width: 1400,
		height: 900,
		icon,
		title: 'Main window',
		// titleBarStyle: 'hidden'
		show: false,
		webPreferences: {
			preload: join(__dirname, '../preload/index.cjs'),
		},
		autoHideMenuBar: true,
	});

	splash = new BrowserWindow({
		width: 600,
		height: 450,
		icon,
		transparent: true,
		frame: false,
	});

	if (app.isPackaged) {
		splash.loadFile(join(__dirname, 'splash.html'));
		win.loadFile(join(__dirname, '../renderer/index.html'));
	} else {
		// 🚧 Use ['ENV_NAME'] avoid vite:define plugin

		// eslint-disable-next-line
		const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

		splash.loadFile(join(__dirname, '../../src/main/splash.html'));
		win.loadURL(url);
		win.webContents.openDevTools();
	}

	// Comment out if any routing issues
	win.webContents.on('will-navigate', (e, url) => {
		e.preventDefault();
		shell.openExternal(url);
	});

	// Test active push message to Renderer-process
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send(
			'main-process-message',
			new Date().toLocaleString(),
		);

		splash?.destroy();
		win?.show();
	});

	// Make all links open with the browser, not with the application
	win?.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});

	// load file opened with app
	win?.webContents.on('did-finish-load', async () => {
		let openWithPath;
		if (process.argv.length > 1) {
			openWithPath = process?.argv[1];
		}
		const fileHandle = FileHandle.openWithFile(macOpenFile || openWithPath);
		if (fileHandle) win?.webContents.send('global-openWith', fileHandle);
	});
}

const template: any = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{ role: 'about' },
						{ type: 'separator' },
						{ role: 'services' },
						{ type: 'separator' },
						{ role: 'hide' },
						{ role: 'hideOthers' },
						{ role: 'unhide' },
						{ type: 'separator' },
						{ role: 'quit' },
					],
				},
		  ]
		: []),
	{
		label: 'File',
		submenu: [
			{
				label: 'New',
				accelerator: 'cmdorctrl + n',
				click: () => {
					win?.webContents.send('menu-new');
				},
			},
			{
				label: 'Open',
				accelerator: 'cmdorctrl + o',
				click: () => {
					win?.webContents.send('menu-open');
				},
			},
			{ type: 'separator' },
			{
				label: 'Save',
				accelerator: 'cmdorctrl + S',
				click: () => {
					win?.webContents.send('menu-save');
				},
			},
			{
				label: 'Save As',
				accelerator: 'shift + cmdorctrl + a',
				click: () => {
					win?.webContents.send('menu-saveAs');
				},
			},
			{ type: 'separator' },
			isMac ? { role: 'close' } : { role: 'quit' },
		],
	},
	{
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			...(isMac
				? [
						{ role: 'pasteAndMatchStyle' },
						{ role: 'delete' },
						{ role: 'selectAll' },
						{ type: 'separator' },
						{
							label: 'Speech',
							submenu: [
								{ role: 'startSpeaking' },
								{ role: 'stopSpeaking' },
							],
						},
				  ]
				: [
						{ role: 'delete' },
						{ type: 'separator' },
						{ role: 'selectAll' },
				  ]),
		],
	},
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' },
		],
	},
	{
		label: 'Window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			...(isMac
				? [
						{ type: 'separator' },
						{ role: 'front' },
						{ type: 'separator' },
						{ role: 'window' },
				  ]
				: [{ role: 'close' }]),
		],
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					await shell.openExternal('https://electronjs.org');
				},
			},
		],
	},
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(createWindow);

/**
 * macOS sepcific open-with-file behaviour
 *
 * OS open file event triggers before the app is ready so we store the path
 * and read it when the application is ready.
 */
app.on('will-finish-launching', () => {
	app.on('open-file', async (event, path) => {
		macOpenFile = path;
	});
});

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

const preferenceService = new Preferences();

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

FileHandle.listen();
export default win;
