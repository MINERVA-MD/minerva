import type IParser from '../interfaces/IParser';

export default class MinervaParser {
	private parser: IParser;

	constructor(parser: IParser) {
		this.parser = parser;
	}

	parse(md: string): string {
		return this.parser.render(md);
	}

	setParser(parser: IParser): void {
		this.parser = parser;
	}
}
