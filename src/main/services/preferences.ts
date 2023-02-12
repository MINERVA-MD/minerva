import fs from 'fs';
import { PREFERENCES_PATH } from '../../common/config/globals';
import defaultPreferences from '../config/defaultPreferences.json';

export interface MinervaPreferences {
	editor: {
		vimMode: boolean;
	};
	theme: [];
}

export default class Preferences {
	path = PREFERENCES_PATH;

	private current: MinervaPreferences;

	constructor() {
		this.createPreferencesIfNoneExist();
		this.current = this.getPreferences();
	}

	createPreferencesIfNoneExist() {
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify(defaultPreferences));
		}
	}

	getPreferences() {
		if (this.current) {
			return this.current;
		}
		return this.loadFromFile();
	}

	loadFromFile() {
		const fileContents = fs.readFileSync(this.path).toString();
		if (!fileContents) {
			return undefined;
		}

		return JSON.parse(fileContents);
	}
}
