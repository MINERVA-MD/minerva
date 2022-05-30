import fs from 'fs';
import path from 'path';

import MarkedParser from '../src/main/services/parsers/marked.parser';
import MinervaParser from '../src/main/services/minerva.parser.service';
import PulldownParser from '../src/main/services/parsers/pulldown.parser';
import MarkdownItParser from '../src/main/services/parsers/markdown-it.parser';

const BENCH_DIR = path.join(__dirname, 'fixtures', 'bench');

const MD_FILE1 = path.join(BENCH_DIR, 'std.md');
const MD_FILE2 = path.join(BENCH_DIR, 'xi.engine.md');
const MD_TBALES_FILE = path.join(BENCH_DIR, 'tables.md');

const parseSpec = (parser: MinervaParser, md: string, title: string): void => {
	console.time(title);
	parser.parse(md);
	console.timeEnd(title);
};

describe('Parsers', () => {
	const MD1 = fs.readFileSync(MD_FILE1, { encoding: 'utf8' });
	const MD2 = fs.readFileSync(MD_FILE2, { encoding: 'utf8' });
	const MD_LARGE = fs.readFileSync(MD_TBALES_FILE, { encoding: 'utf8' });

	it('Should Benchmark Parsers w/ Standard Markdown Files', () => {
		const parser = new MinervaParser(new MarkedParser());
		parseSpec(parser, MD1, 'Marked 1');
		parseSpec(parser, MD2, 'Marked 2');
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

		parser.setParser(new MarkdownItParser());
		parseSpec(parser, MD1, 'MarkdownIt 1');
		parseSpec(parser, MD2, 'MarkdownIt 2');
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

		parser.setParser(new PulldownParser());
		parseSpec(parser, MD1, 'Pulldown 1');
		parseSpec(parser, MD2, 'Pulldown 2');
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	});

	it('Should Benchmark Parsers w/ Large files', () => {
		const parser = new MinervaParser(new MarkedParser());
		parseSpec(parser, MD_LARGE, 'Marked');
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

		parser.setParser(new MarkdownItParser());
		parseSpec(parser, MD_LARGE, 'MarkdownIt');
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

		parser.setParser(new PulldownParser());
		parseSpec(parser, MD_LARGE, 'Pulldown');
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	});
});
