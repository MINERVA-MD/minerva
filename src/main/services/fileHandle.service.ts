import { dialog, ipcMain } from 'electron';
import fs from 'fs';

export default class FileHandle {
	static listen() {
		ipcMain.handle('saveAsFile', (event, editorData) => {
			return this.saveAsFile(editorData);
		});

		ipcMain.handle('saveFile', (event, filePath, editorData) => {
			return this.saveFile(filePath, editorData);
		});

		ipcMain.handle('loadFile', async () => {
			return this.loadFile();
		});
	}

	static saveAsFile(data: string) {
		const savePath = dialog.showSaveDialogSync({});
		if (savePath) {
			fs.writeFileSync(savePath, data);
		}
		return savePath;
	}

	static saveFile(filePath: string, data: string) {
		if (fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, data);
		}
	}

	static async loadFile() {
		const { filePaths } = await dialog.showOpenDialog({
			filters: [
				{
					name: 'Supported files',
					extensions: ['md', 'markdown', 'fountain'],
				},
			],
			properties: ['openFile'],
		});

		const [path] = filePaths;

		let content = '';
		try {
			content = fs.readFileSync(path).toString();
		} catch (error) {
			console.error(error);
		}
		return {
			path,
			content,
		};
	}

	static openWithFile(
		path?: string,
	): undefined | { path: string; content: string } {
		if (!path) {
			return undefined;
		}
		if (!fs.lstatSync(path).isFile()) {
			return undefined;
		}

		let content = '';
		try {
			content = fs.readFileSync(path).toString();
		} catch (error) {
			console.error(error);
		}
		return {
			path,
			content,
		};
	}
}
