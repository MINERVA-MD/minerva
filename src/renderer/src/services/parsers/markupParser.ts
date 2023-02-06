export type Target = 'markdown' | 'fountain';

// this will be a bigger part of a global config that uses dependency injection
export default abstract class MarkupParser {
	static target: Target;

	/** Path to css required for preview */
	static cssPath?: string;

	/** Function that takes in raw markup and produces formatted text */
	static parse: (content: string) => string;
}
