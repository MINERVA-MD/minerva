import fs from 'fs';
import path from 'path';
import { app } from 'electron';

// eslint-disable-next-line import/prefer-default-export
export const getSecret = (key: string): string => {
	// const ENV_PATH = 'env.json';
	const ENV_PATH = path.join(app.getPath('documents'), '/Minerva/env.json');

	if (fs.existsSync(ENV_PATH)) {
		const secretsJSON = JSON.parse(
			fs.readFileSync(ENV_PATH, { encoding: 'utf8' }),
		);
		// Throw error here
		return secretsJSON[key] || '';
	}
	return '';
};
