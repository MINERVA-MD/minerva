import MarkdownIt from 'markdown-it';

import type IParser from '../../interfaces/IParser';

export default class MarkdownItParser implements IParser {
	private md: MarkdownIt;

	constructor() {
		this.md = new MarkdownIt();
	}

	render(md: string): string {
		return this.md.render(md);
	}
}
