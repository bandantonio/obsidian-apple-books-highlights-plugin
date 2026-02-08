import type { IBook, IAnnotation, IBookWithAnnotations, IHighlightsSortingCriterion } from '../types';
import { getBooks, getAnnotations } from './dataFetching';

export const aggregateBooksWithAnnotations = async (sortingCriterion: IHighlightsSortingCriterion): Promise<IBookWithAnnotations[]> => {
  const [books, annotations] = await Promise.all([
    getBooks(),
    getAnnotations(sortingCriterion)
  ]);
  
  const annotationsMap = new Map<string, IAnnotation[]>();
  mapAnnotationsToBooks(annotations, annotationsMap);

  const booksWithAnnotations: IBookWithAnnotations[] = [];
  enrichBooksWithAnnotations(books, annotationsMap, booksWithAnnotations);

  return booksWithAnnotations;
};

export function enrichBooksWithAnnotations(books: IBook[], annotationsMap: Map<string, IAnnotation[]>, booksWithAnnotations: IBookWithAnnotations[]) {
  for (const book of books) {   
    const { bookId, bookTitle, bookAuthor, bookGenre, bookLanguage, bookLastOpenedDate, bookFinishedDate, bookCoverUrl } = book;
    
    const bookRelatedAnnotations = annotationsMap.get(bookId) || [];
    if (bookRelatedAnnotations.length > 0) {
      const normalizedBookTitle = cleanUpTitle(bookTitle);
      booksWithAnnotations.push({
        bookId,
        bookTitle: normalizedBookTitle,
        bookAuthor,
        bookGenre,
        bookLanguage,
        bookLastOpenedDate,
        bookFinishedDate,
        bookCoverUrl,
        annotations: bookRelatedAnnotations.map((annotation) => {
          const { assetId, chapter, contextualText: rawContextualText, highlight: rawHighlight, note: rawNote, highlightLocation, highlightStyle, highlightCreationDate, highlightModificationDate } = annotation;

          return {
            assetId,
            chapter,
            contextualText: removeTrailingSpaces(preserveNewlineIndentation(rawContextualText)),
            highlight: preserveNewlineIndentation(rawHighlight),
            note: rawNote ? preserveNewlineIndentation(rawNote) : rawNote,
            highlightLocation,
            highlightStyle,
            highlightCreationDate,
            highlightModificationDate,
          };
        }),
      });
    }
  }
}

export function mapAnnotationsToBooks(annotations: IAnnotation[], annotationsMap: Map<string, IAnnotation[]>) {
  for (const annotation of annotations) {
    const bookId = annotation.assetId;
    if (!annotationsMap.has(bookId)) {
      annotationsMap.set(bookId, []);
    }
    annotationsMap.get(bookId)!.push(annotation);
  }
}

export function cleanUpTitle(title: string): string {
  // Obsidian forbids adding certain characters to the title of a note, so they must be replaced with a dash (-)
  // | # ^ [] \ / :
  // after the replacement, two or more spaces are replaced with a single one
  return title
    .replace(/[|#^[\]\\/:]+/g, '-')
    .replace(/\s{2,}/g, ' ');
}

export const removeTrailingSpaces = (textBlock: string): string => {
  // Handler of all space, tab or newline characters at the end of text blocks to prevent new lines appearing
  const endLineSpaces = /\s+$/;

  return endLineSpaces.test(textBlock) ? textBlock.replace(endLineSpaces, '') : textBlock;
};

export const preserveNewlineIndentation = (textBlock: string): string => {
  // Handler of double new line characters (\n\n) to preserve proper indentation in text blocks
  const stringWithNewLines = /\n+\s*/g;

  return stringWithNewLines.test(textBlock) ? textBlock.replace(stringWithNewLines, '\n') : textBlock;
};

export const normalizeAnnotationLocation = (location: string): string => {
  const normalizedLocation = location
    .slice(8, -1)	              // Get rid of the epubcfi() wrapper
    .replace(/\[.*?\]/g, '')    // Get rid of bracketed assertions
    .replace(/\d+/g, (num) => num.padStart(4, '0'))   // Pad numbers to 4 digits for consistent comparison
  
  return normalizedLocation;
};

export const sortByLocation = (annotations: IAnnotation[]) => {
  return annotations.sort((a, b) => {
      const normalizedFirstLocation = normalizeAnnotationLocation(a.highlightLocation);
      const normalizedSecondLocation = normalizeAnnotationLocation(b.highlightLocation);
      
      return normalizedFirstLocation.localeCompare(normalizedSecondLocation);
    });
}