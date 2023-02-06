import { marked } from 'marked';
import type { Target } from './markupParser';
import MarkupParser from './markupParser';

export default class Markdown extends MarkupParser {
	static target: Target = 'markdown';

	static cssPath = './css/index.css';

	static parse(content: string) {
		return marked.parse(content);
	}
}
