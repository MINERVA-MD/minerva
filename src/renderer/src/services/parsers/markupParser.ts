export type Target = 'markdown' | 'fountain';

// this will be a bigger part of a global config that uses dependency injection
export interface MarkupParser {
	target: Target;

	/** Path to css required for preview */
	className?: string;

	/** Function that takes in raw markup and produces formatted text */
	parse: (content: string) => string;
}
