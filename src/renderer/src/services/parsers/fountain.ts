import { Fountain as Ftn } from 'fountain-js';
import type { Target, MarkupParser } from './markupParser';

export default class Fountain implements MarkupParser {
	target: Target = 'fountain';

	className = 'screenplay';

	// eslint-disable-next-line class-methods-use-this
	parse(content: string) {
		const script = new Ftn().parse(content);
		return script.html.script === '<p>undefined</p>'
			? ''
			: script.html.script;
	}
}
