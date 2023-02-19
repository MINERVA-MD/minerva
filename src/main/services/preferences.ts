import fs from 'fs';
import type { MinervaPreferences } from '../../types/MinervaPreferences';
import { MINERVA_PATH, PREFERENCES_PATH } from '../../common/config/globals';
import defaultPreferences from '../config/defaultPreferences.json';

export default class Preferences {
	minervaDir = MINERVA_PATH;

	configPath = PREFERENCES_PATH;

	private config: MinervaPreferences;

	constructor() {
		this.createPreferencesIfNoneExist();
		this.config = this.getPreferences();
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

	getPreferences(): MinervaPreferences {
		if (this.config) {
			return this.config;
		}
		return this.loadFromFile();
	}

	loadFromFile(): MinervaPreferences {
		const fileContents = fs.readFileSync(this.configPath).toString();
		return JSON.parse(fileContents);
	}
}
