import { dialog, ipcMain } from 'electron';
import fs from 'fs';

export default class FileHandle {
	static listen() {
		ipcMain.handle('saveAsFile', (event, editorData) => {
			this.saveAsFile(editorData);
		});
	}

	static saveAsFile(data: string) {
		const savePath = dialog.showSaveDialogSync({});
		if (savePath) {
			this.writeFileToPath(savePath, data);
		}
	}

	static writeFileToPath(path: string, data: string) {
		fs.writeFileSync(path, data);
	}
}
