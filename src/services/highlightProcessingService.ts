import type { ICombinedBooksAndHighlights, IDataService, IHighlight, IHighlightProcessingService } from '../types';
import { IHighlightsSortingCriterion } from '../types';
import { preserveNewlineIndentation, removeTrailingSpaces } from '../utils';
// import { renderHighlightsTemplate } from '../methods/renderHighlightsTemplate';

export class HighlightProcessingService implements IHighlightProcessingService {
  private dataService: IDataService;

  constructor(dataService: IDataService) {
    this.dataService = dataService;
  }

  async aggregateHighlights(): Promise<ICombinedBooksAndHighlights[]> {
    try {
      const books = await this.dataService.getBooks();
      const annotations = await this.dataService.getAnnotations();

      const resultingHighlights: ICombinedBooksAndHighlights[] = books.reduce((highlights: ICombinedBooksAndHighlights[], book) => {
        const bookRelatedAnnotations = annotations.filter((annotation) => annotation.ZANNOTATIONASSETID === book.ZASSETID);

        if (bookRelatedAnnotations.length > 0) {
          // Obsidian forbids adding certain characters to the title of a note, so they must be replaced with a dash (-)
          // | # ^ [] \ / :
          // after the replacement, two or more spaces are replaced with a single one
          const normalizedBookTitle = book.ZTITLE.replace(/[|#^[\]\\/:]+/g, ' -').replace(/\s{2,}/g, ' ');

          highlights.push({
            bookTitle: normalizedBookTitle,
            bookId: book.ZASSETID,
            bookAuthor: book.ZAUTHOR,
            bookGenre: book.ZGENRE,
            bookLanguage: book.ZLANGUAGE,
            bookLastOpenedDate: book.ZLASTOPENDATE,
            bookFinishedDate: book.ZDATEFINISHED,
            bookCoverUrl: book.ZCOVERURL,
            annotations: bookRelatedAnnotations.map((annotation) => {
              const textForContext = annotation.ZANNOTATIONREPRESENTATIVETEXT;
              const userNote = annotation.ZANNOTATIONNOTE;

              return {
                chapter: annotation.ZFUTUREPROOFING5,
                contextualText: removeTrailingSpaces(preserveNewlineIndentation(textForContext)),
                highlight: preserveNewlineIndentation(annotation.ZANNOTATIONSELECTEDTEXT),
                note: userNote ? preserveNewlineIndentation(userNote) : userNote,
                highlightLocation: annotation.ZANNOTATIONLOCATION,
                highlightStyle: annotation.ZANNOTATIONSTYLE,
                highlightCreationDate: annotation.ZANNOTATIONCREATIONDATE,
                highlightModificationDate: annotation.ZANNOTATIONMODIFICATIONDATE,
              };
            }),
          });
        }

        return highlights;
      }, []);
      return resultingHighlights;
    } catch (error) {
      throw new Error(`Error aggregating highlights: ${(error as Error).message}`);
    }
  }

  sortHighlights(
    combinedHighlight: ICombinedBooksAndHighlights,
    highlightsSortingCriterion: IHighlightsSortingCriterion,
  ): ICombinedBooksAndHighlights {
    let sortedHighlights: IHighlight[] = [];

    switch (highlightsSortingCriterion) {
      case IHighlightsSortingCriterion.CreationDateOldToNew:
        sortedHighlights = combinedHighlight.annotations.sort((a, b) => a.highlightCreationDate - b.highlightCreationDate);
        break;
      case IHighlightsSortingCriterion.CreationDateNewToOld:
        sortedHighlights = combinedHighlight.annotations.sort((a, b) => b.highlightCreationDate - a.highlightCreationDate);
        break;
      case IHighlightsSortingCriterion.LastModifiedDateOldToNew:
        sortedHighlights = combinedHighlight.annotations.sort((a, b) => a.highlightModificationDate - b.highlightModificationDate);
        break;
      case IHighlightsSortingCriterion.LastModifiedDateNewToOld:
        sortedHighlights = combinedHighlight.annotations.sort((a, b) => b.highlightModificationDate - a.highlightModificationDate);
        break;
      case IHighlightsSortingCriterion.Book:
        sortedHighlights = combinedHighlight.annotations.sort((a, b) => {
          const firstHighlightLocation = this.highlightLocationToNumber(a.highlightLocation);
          const secondHighlightLocation = this.highlightLocationToNumber(b.highlightLocation);

          return this.compareLocations(firstHighlightLocation, secondHighlightLocation);
        });
        break;
    }

    return {
      ...combinedHighlight,
      annotations: sortedHighlights,
    };
  }

  // The function converts a highlight location string to an array of numbers
  // biome-ignore format: the current format is easier to read and understand
  highlightLocationToNumber(highlightLocation: string): number[] {
    // epubcfi example structure: epubcfi(/6/2[body01]!/4/2/2/1:0)
    return highlightLocation
      // biome-ignore lint/style/noMagicNumbers: 8 and -1 are positions of the epubcfi( and ) characters
      .slice(8, -1)	// Get rid of the epubcfi() wrapper
      .split(',')		// Split the locator into three parts: the common parent, the start subpath, and the end subpath
      .slice(0, -1)	// Get rid of the end subpath (third part)
      .join(',')		// Join the first two parts back together
      .match(/(?<!\[)[/:]\d+(?!\])/g)!         // Extract all the numbers (except those in square brackets) from the first two parts
      .map(match => parseInt(match.slice(1)))	 // Get rid of the leading slash or colon and convert the string to a number
  }
  // biome-ignore format: the current format is easier to read and understand

  compareLocations = (firstLocation: number[], secondLocation: number[]) => {
    // Loop through each element of both arrays up to the length of the shorter one
    for (let i = 0; i < Math.min(firstLocation.length, secondLocation.length); i++) {
      if (firstLocation[i] < secondLocation[i]) {
        return -1;
      }
      if (firstLocation[i] > secondLocation[i]) {
        return 1;
      }
    }

    // If the loop didn't return, the arrays are equal up to the length of the shorter array
    // so the function returns the difference in lengths to determine the order of the corresponding locations
    return firstLocation.length - secondLocation.length;
  }
}
