// Handler of all space, tab or newline characters at the end of text blocks to prevent new lines appearing
export const removeTrailingSpaces = (textBlock: string): string => {
  const endLineSpaces = /\s+$/;

  return endLineSpaces.test(textBlock) ? textBlock.replace(endLineSpaces, '') : textBlock;
};
