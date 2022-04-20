import { marked } from 'marked';

import MARKED_SETTINGS from '../config/parsing';

marked.setOptions(MARKED_SETTINGS);

export default class PreviewService {
	static generatePreview(md: string): string {
		return marked.parse(md);
	}
}
