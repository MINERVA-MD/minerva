import { parse } from 'pulldown-cmark-wasm';
import type IParser from '../../interfaces/IParser';

export default class PulldownParser implements IParser {
	// eslint-disable-next-line class-methods-use-this
	render(md: string): string {
		return parse(md);
	}
}
