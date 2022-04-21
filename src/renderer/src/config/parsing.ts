import hljs from 'highlight.js';

const MARKED_SETTINGS = {
	highlight(code: string, lang: string) {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
	},
	langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
	pedantic: false,
	gfm: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: false,
};

export default MARKED_SETTINGS;
