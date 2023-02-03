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

	static async loadFile(path?: string) {
		let filePath = path || '';
		if (!path) {
			const { filePaths } = await dialog.showOpenDialog({
				filters: [{ name: 'Markdown', extensions: ['md'] }],
				properties: ['openFile'],
			});

			filePath = filePaths[0];
		}

		const content = fs.readFileSync(filePath).toString();

		return {
			path: filePath,
			content,
		};
	}
}
