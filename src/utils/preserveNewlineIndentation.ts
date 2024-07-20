// Handler of double new line characters (\n\n) to preserve proper indentation in text blocks
export const preserveNewlineIndentation = (textBlock: string): string => {
	const stringWithNewLines = /\n+\s*/g;

	return stringWithNewLines.test(textBlock) ? textBlock.replace(stringWithNewLines, '\n') : textBlock;
}
