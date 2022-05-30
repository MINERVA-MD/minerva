import { marked } from 'marked';

import type IParser from '../../interfaces/IParser';

export default class MarkedParser implements IParser {
	// eslint-disable-next-line class-methods-use-this
	render(md: string): string {
		return marked(md);
	}
}
