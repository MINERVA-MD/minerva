import fs from 'fs';
import { MINERVA_PATH, PREFERENCES_PATH } from '../../common/config/globals';
import defaultPreferences from '../config/defaultPreferences.json';

export interface MinervaPreferences {
	editor: {
		vimMode: boolean;
	};
	theme: [];
}

export default class Preferences {
	minervaDir = MINERVA_PATH;

	configPath = PREFERENCES_PATH;

	private current: MinervaPreferences;

	constructor() {
		this.createPreferencesIfNoneExist();
		this.current = this.getPreferences();
	}

	createPreferencesIfNoneExist() {
		if (!fs.existsSync(this.minervaDir)) {
			fs.mkdirSync(this.minervaDir);
		}
		if (!fs.existsSync(this.configPath)) {
			fs.writeFileSync(
				this.configPath,
				JSON.stringify(defaultPreferences),
			);
		}
	}

	getPreferences() {
		if (this.current) {
			return this.current;
		}
		return this.loadFromFile();
	}

	loadFromFile() {
		const fileContents = fs.readFileSync(this.configPath).toString();
		if (!fileContents) {
			return undefined;
		}
		return JSON.parse(fileContents);
	}
}
