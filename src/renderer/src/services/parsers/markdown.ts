import { marked } from 'marked';
import MARKED_SETTINGS from '../../config/parsing';
import type { Target, MarkupParser } from './markupParser';

export default class Markdown implements MarkupParser {
	target: Target = 'markdown';

	className = 'markdown-body';

	// eslint-disable-next-line class-methods-use-this
	parse(content: string) {
		marked.setOptions(MARKED_SETTINGS);
		return marked.parse(content);
	}
}
