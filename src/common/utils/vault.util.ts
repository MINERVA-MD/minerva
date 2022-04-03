import fs from 'fs';

export const getSecret = (key: string): string => {
	const ENV_PATH = 'env.json';

	if (fs.existsSync(ENV_PATH)) {
		const secretsJSON = JSON.parse(
			fs.readFileSync(ENV_PATH, { encoding: 'utf8' }),
		);
		// Throw error here
		return secretsJSON[key] || '';
	}
	return '';
};
