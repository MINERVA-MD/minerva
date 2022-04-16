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
}
