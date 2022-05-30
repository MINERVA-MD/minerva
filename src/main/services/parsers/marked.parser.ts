import { marked } from 'marked';
import hljs from 'highlight.js';
import type IParser from '../../interfaces/IParser';

marked.setOptions({
	renderer: new marked.Renderer(),
	highlight(code, lang) {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
	},
	langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
	pedantic: false,
	gfm: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	xhtml: false,
});

export default class MarkedParser implements IParser {
	// eslint-disable-next-line class-methods-use-this
	render(md: string): string {
		return marked(md);
	}
}
