import { describe, expect, test } from 'vitest';
import { compareLocations, highlightLocationToNumber, sortHighlights } from '../src/methods/sortHighlights';
import { type ICombinedBooksAndHighlights, IHighlightsSortingCriterion } from '../src/types';
import { aggregatedUnsortedHighlights, annotationFour, annotationOne, annotationThree, annotationTwo } from './mocks/aggregatedDetailsData';

describe('sortHighlights', () => {
  describe('Highlights sorting criterion', () => {
    test('Should sort highlights by creation date from oldest to newest', () => {
      const highlightsSortingCriterion = IHighlightsSortingCriterion.CreationDateOldToNew;

      const actual = sortHighlights(aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights, highlightsSortingCriterion);

      const expectedSortingForHighlights = {
        ...aggregatedUnsortedHighlights[0],
        annotations: [annotationThree, annotationTwo, annotationFour, annotationOne],
      };

      expect(actual).toEqual(expectedSortingForHighlights);
    });

    test('Should sort highlights by creation date from newest to oldest', () => {
      const highlightsSortingCriterion = IHighlightsSortingCriterion.CreationDateNewToOld;

      const actual = sortHighlights(aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights, highlightsSortingCriterion);

      const expectedSortingForHighlights = {
        ...aggregatedUnsortedHighlights[0],
        annotations: [annotationOne, annotationFour, annotationTwo, annotationThree],
      };

      expect(actual).toEqual(expectedSortingForHighlights);
    });

    test('Should sort highlights by modification date from oldest to newest', () => {
      const highlightsSortingCriterion = IHighlightsSortingCriterion.LastModifiedDateOldToNew;

      const actual = sortHighlights(aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights, highlightsSortingCriterion);

      const expectedSortingForHighlights = {
        ...aggregatedUnsortedHighlights[0],
        annotations: [annotationFour, annotationOne, annotationTwo, annotationThree],
      };

      expect(actual).toEqual(expectedSortingForHighlights);
    });

    test('Should sort highlights by modification date from newest to oldest', () => {
      const highlightsSortingCriterion = IHighlightsSortingCriterion.LastModifiedDateNewToOld;

      const actual = sortHighlights(aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights, highlightsSortingCriterion);

      const expectedSortingForHighlights = {
        ...aggregatedUnsortedHighlights[0],
        annotations: [annotationThree, annotationTwo, annotationOne, annotationFour],
      };

      expect(actual).toEqual(expectedSortingForHighlights);
    });

    test('Should sort highlights by location in a book', () => {
      const highlightsSortingCriterion = IHighlightsSortingCriterion.Book;

      const actual = sortHighlights(aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights, highlightsSortingCriterion);

      const expectedSortingForHighlights = {
        ...aggregatedUnsortedHighlights[0],
        annotations: [annotationOne, annotationTwo, annotationThree, annotationFour],
      };

      expect(actual).toEqual(expectedSortingForHighlights);
    });
  });

  // biome-ignore-start lint/style/noMagicNumbers: Magic numbers represent specific highlight locations in the book.
  describe('sortHighlights auxiliary functions', () => {
    describe('highlightLocationToNumber', () => {
      test('Should return the correct array of numbers from a highlight location', () => {
        const highlightLocations = [
          'epubcfi(/6/2[iphd3c6e37c7]!/4[iphd3c6e37c7]/6[iphefb3daa42]/6[iph22e5dfab7]/4/2/1,:0,:28)',
          'epubcfi(/6/12[chapter1]!/4/2/16/1,:0,:87)',
          'epubcfi(/6/12[x06_Introduction_How]!/4[x9780593422984_EPUB-4]/2/82,/1:0,/5:98)',
          'epubcfi(/6/28[chapter-idp13097504]!/4/2/2[labeling_systems]/24/2[recap-id00006]/6/6/2/1,:0,:120)',
          'epubcfi(/6/34[data-uuid-42e193cde5544ad5ac31696d78c19bf9]!/4/16[data-uuid-59056f0b33a144929eb7810513ae7131],/1:0,/1:292)',
          'epubcfi(/6/34[chap10]!/4/2[chap10.html]/8/8,/2/1:0,/4/1:11)',
          'epubcfi(/6/36[ch10]!/4/2/10,/1:19,/3:113)',
          'epubcfi(/6/72[x9780735211308_EPUB-34]!/4[x9780735211308_EPUB-34]/2,/58/3:1,/60/1:53)',
          'epubcfi(/6/86[chapter00191]!/4/166/1,:10,:197)',
          'epubcfi(/6/198[ch15_sub01]!/4/2/3,:0,:96)',
        ];

        const expectedNumbers = [
          [6, 2, 4, 6, 6, 4, 2, 1, 0],
          [6, 12, 4, 2, 16, 1, 0],
          [6, 12, 4, 2, 82, 1, 0],
          [6, 28, 4, 2, 2, 24, 2, 6, 6, 2, 1, 0],
          [6, 34, 4, 16, 1, 0],
          [6, 34, 4, 2, 8, 8, 2, 1, 0],
          [6, 36, 4, 2, 10, 1, 19],
          [6, 72, 4, 2, 58, 3, 1],
          [6, 86, 4, 166, 1, 10],
          [6, 198, 4, 2, 3, 0],
        ];

        highlightLocations.forEach((highlightLocation, index) => {
          const actual = highlightLocationToNumber(highlightLocation);
          expect(actual).toEqual(expectedNumbers[index]);
        });
      });
    });

    describe('compareLocations', () => {
      test('Should return -1 if the first location is less than the second one', () => {
        const firstLocation = [6, 12, 4, 2, 16, 1, 0];
        const secondLocation = [6, 12, 4, 2, 82, 1, 0];
        const actual = compareLocations(firstLocation, secondLocation);
        expect(actual).toBe(-1);
      });

      test('Should return 1 if the first location is greater than the second one', () => {
        const firstLocation = [6, 12, 4, 2, 82, 1, 0];
        const secondLocation = [6, 12, 4, 2, 16, 1, 0];
        const actual = compareLocations(firstLocation, secondLocation);
        expect(actual).toBe(1);
      });

      test('Should return the positive difference (+2) in lengths if the locations are equal up to the length of the shorter one (first location)', () => {
        const firstLocation = [6, 34, 4, 16, 1, 10, 2, 0];
        const secondLocation = [6, 34, 4, 16, 1, 10];
        const actual = compareLocations(firstLocation, secondLocation);
        expect(actual).toBe(2);
      });

      test('Should return the negative difference (-2) in lengths if the locations are equal up to the length of the shorter one (second location)', () => {
        const firstLocation = [6, 34, 4, 16, 1, 10];
        const secondLocation = [6, 34, 4, 16, 1, 10, 2, 0];
        const actual = compareLocations(firstLocation, secondLocation);
        expect(actual).toBe(-2);
      });

      test('Should return 0 if the locations are equal', () => {
        const firstLocation = [6, 12, 4, 2, 16, 1, 0];
        const secondLocation = [6, 12, 4, 2, 16, 1, 0];
        const actual = compareLocations(firstLocation, secondLocation);
        expect(actual).toBe(0);
      });
    });
  });
  // biome-ignore-end lint/style/noMagicNumbers: Magic numbers represent specific highlight locations in the book.
});
