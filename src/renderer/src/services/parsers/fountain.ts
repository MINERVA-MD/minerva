import { Fountain as Ftn } from 'fountain-js';
import MarkupParser, { type Target } from './markupParser';

export default class Fountain extends MarkupParser {
	static target: Target = 'fountain';

	static parse(content: string) {
		const script = new Ftn().parse(content);
		return script.html.script === '<p>undefined</p>'
			? ''
			: script.html.script;
	}
}
