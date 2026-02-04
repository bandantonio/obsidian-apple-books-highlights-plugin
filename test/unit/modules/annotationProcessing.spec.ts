import { describe, expect, test } from 'vitest';
import { purchasedBooks, notDeletedAnnotations } from '../../mocks/dataFetch';
import { aggregatedBooksAndAnnotations } from '../../mocks/aggregatedBooksAndAnnotations';
import { cleanUpTitle, mapAnnotationsToBooks, enrichBooksWithAnnotations, preserveNewlineIndentation, removeTrailingSpaces } from '../../../src/modules/annotationsProcessing';
import type { IAnnotation, IBookWithAnnotations } from '../../../src/types';

describe('annotationsProcessing', () => {
  describe('mapAnnotationsToBooks', () => {
    test('Should correctly map annotations to their respective books based on an empty map', () => {
      const annotationsMap = new Map();
      mapAnnotationsToBooks(notDeletedAnnotations, annotationsMap);

      expect(annotationsMap.size).toBe(3);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE1')!.length).toBe(1);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE2')!.length).toBe(1);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE3')!.length).toBe(2);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE3')![1].highlight).toBe('duplicated highlight from the Mac User Guide');
    });

    test('Should correctly map annotations to their respective books if bookId already exists in the map', () => {
      const annotationsMap = new Map<string, IAnnotation[]>();
      annotationsMap.set('THBFYNJKTGFTTVCGSAE1', []);

      mapAnnotationsToBooks(notDeletedAnnotations, annotationsMap);

      expect(annotationsMap.size).toBe(3);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE1')!.length).toBe(1);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE2')!.length).toBe(1);
      expect(annotationsMap.get('THBFYNJKTGFTTVCGSAE3')!.length).toBe(2);
    });
  });

  describe('enrichBooksWithAnnotations', () => {
    test('Should correctly add books information to annotations based on an empty map', () => {
      const annotationsMap = new Map(
        [
          ['THBFYNJKTGFTTVCGSAE1', [notDeletedAnnotations[0]]],
          ['THBFYNJKTGFTTVCGSAE2', [notDeletedAnnotations[1]]],
          ['THBFYNJKTGFTTVCGSAE3', [notDeletedAnnotations[2], notDeletedAnnotations[3]]],
        ]
      );
      const booksWithAnnotations: IBookWithAnnotations[] = [];

      enrichBooksWithAnnotations(purchasedBooks, annotationsMap, booksWithAnnotations);

      expect(booksWithAnnotations.length).toBe(3);
      expect(booksWithAnnotations).toEqual(aggregatedBooksAndAnnotations);
    });
  });

  describe('cleanUpTitle', () => {
    test('Should remove all the forbidden characters from the title', () => {
      const rawTitle = 'This |   is:# a ^ test [title]\\ with  #lots / of ^ forbidden // : characters   and  spaces';
      const rawTitle2 = 'Apple iPhone: User Guide | Instructions ^ with # restricted [ [symbols] ] in  / title \\';
      const cleanedTitle = cleanUpTitle(rawTitle);
      const cleanedTitle2 = cleanUpTitle(rawTitle2);

      expect(cleanedTitle).toBe('This - is- a - test -title- with -lots - of - forbidden - - characters and spaces');
      expect(cleanedTitle2).toBe('Apple iPhone- User Guide - Instructions - with - restricted - -symbols- - in - title -');
    });

    test('Should pass through emojis and other special characters allowed in Obsidian', () => {
      const rawTitle = '📕 This is a @test %title ✅ with emojis 🚀 and special characters';
      const cleanedTitle = cleanUpTitle(rawTitle);

      expect(cleanedTitle).toBe(rawTitle);
    });
  });

  describe('removeTrailingSpaces', () => {
    test('Should remove a newline character at the end of text', () => {
      const text = 'This is an example text to test the removal of a newline character at the end of the text.\n';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of a newline character at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove double newline characters at the end of text', () => {
      const text = 'This is an example text to test the removal of double newline characters at the end of the text.\n\n';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of double newline characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove triple newline characters at the end of text', () => {
      const text = 'This is an example text to test the removal of triple newline characters at the end of the text.\n\n\n';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of triple newline characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove many newline characters at the end of text', () => {
      const text =
        'This is an example text to test the removal of many newline characters at the end of the text.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of many newline characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove many newline characters at the end of text while preserving space, tab and newline characters within the text', () => {
      const text =
        'This is an example text to test the removal of many newline characters at the end of the text while preserving space , tab\t and newline\n characters within the text.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
      const actual = removeTrailingSpaces(text);
      const expected =
        'This is an example text to test the removal of many newline characters at the end of the text while preserving space , tab\t and newline\n characters within the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove a tab character at the end of text', () => {
      const text = 'This is an example text to test the removal of a tab character at the end of the text.\t';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of a tab character at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove double tab characters at the end of text', () => {
      const text = 'This is an example text to test the removal of double tab characters at the end of the text.\t\t';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of double tab characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove triple tab characters at the end of text', () => {
      const text = 'This is an example text to test the removal of triple tab characters at the end of the text.\t\t\t';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of triple tab characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove many tab characters at the end of text', () => {
      const text =
        'This is an example text to test the removal of many tab characters at the end of the text.\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of many tab characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove many tab characters at the end of text while preserving space, tab and newline characters within the text', () => {
      const text =
        'This is an example text to test the removal of many tab characters at the end of the text while preserving space , tab\t and newline\n characters within the text.\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
      const actual = removeTrailingSpaces(text);
      const expected =
        'This is an example text to test the removal of many tab characters at the end of the text while preserving space , tab\t and newline\n characters within the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove a space character at the end of text', () => {
      const text = 'This is an example text to test the removal of a space character at the end of the text. ';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of a space character at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove double space characters at the end of text', () => {
      const text = 'This is an example text to test the removal of double space characters at the end of the text.  ';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of double space characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove triple space characters at the end of text', () => {
      const text = 'This is an example text to test the removal of triple space characters at the end of the text.   ';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of triple space characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove many space characters at the end of text', () => {
      const text =
        'This is an example text to test the removal of many space characters at the end of the text.                              ';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of many space characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove many space characters at the end of text while preserving space, tab and newline characters at the end of the text.', () => {
      const text =
        'This is an example text to test the removal of many space characters at the end of the text preserving space , tab\b and newline\n characters at the end of the text.                              ';
      const actual = removeTrailingSpaces(text);
      const expected =
        'This is an example text to test the removal of many space characters at the end of the text preserving space , tab\b and newline\n characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove multiple space, tab and newline characters at the end of text', () => {
      const text =
        'This is an example text to test the removal of many space, tab and newline characters at the end of the text. \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t ';
      const actual = removeTrailingSpaces(text);
      const expected = 'This is an example text to test the removal of many space, tab and newline characters at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should remove multiple space, tab and newline characters at the end of text while preserving space, tab and newline characters within text', () => {
      const text =
        'This is an example text to test the removal of many space , tab\t and newline\n characters at the end of the text while preserving space, tab and newline characters within text. \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t ';
      const actual = removeTrailingSpaces(text);
      const expected =
        'This is an example text to test the removal of many space , tab\t and newline\n characters at the end of the text while preserving space, tab and newline characters within text.';

      expect(actual).toEqual(expected);
    });

    test('Should return the text when no space, tab or newline characters exist at the end of the text', () => {
      const text =
        'This is an example text to test that the text is returned when no space, tab or newline characters exist at the end of the text.';
      const actual = removeTrailingSpaces(text);
      const expected =
        'This is an example text to test that the text is returned when no space, tab or newline characters exist at the end of the text.';

      expect(actual).toEqual(expected);
    });

    test('Should return the text when no space, tab or newline characters exist at the end of the text while preserving space, tab and newline characters within text', () => {
      const text =
        'This is an example text to test that the text is returned when no space , tab\t or newline\n characters exist at the end of the text while preserving space, tab and newline characters within text.';
      const actual = removeTrailingSpaces(text);
      const expected =
        'This is an example text to test that the text is returned when no space , tab\t or newline\n characters exist at the end of the text while preserving space, tab and newline characters within text.';

      expect(actual).toEqual(expected);
    });
  });

  describe('preserveNewlineIndentation', () => {
    test('Should preserve single newline characters within text', () => {
      const text =
        'This is an example text to test the preservation of single newline characters within the text.\nHere is a new line after a single newline character.';
      const actual = preserveNewlineIndentation(text);
      const expected =
        'This is an example text to test the preservation of single newline characters within the text.\nHere is a new line after a single newline character.';

      expect(actual).toEqual(expected);
    });

    test('Should replace double newline characters with a single one within text', () => {
      const text =
        'This is an example text to test the preservation of double newline characters within the text.\n\nHere is a new line after double newline characters.';
      const actual = preserveNewlineIndentation(text);
      const expected =
        'This is an example text to test the preservation of double newline characters within the text.\nHere is a new line after double newline characters.';

      expect(actual).toEqual(expected);
    });

    test('Should replace triple newline characters with a single one within text', () => {
      const text =
        'This is an example text to test the preservation of triple newline characters within the text.\n\n\nHere is a new line after triple newline characters.';
      const actual = preserveNewlineIndentation(text);
      const expected =
        'This is an example text to test the preservation of triple newline characters within the text.\nHere is a new line after triple newline characters.';
      
      expect(actual).toEqual(expected);
    });

    test('Should replace many newline characters with a single one within text', () => {
      const text =
        'This is an example text to test the preservation of many newline characters within the text.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nHere is a new line after many newline characters.';
      const actual = preserveNewlineIndentation(text);
      const expected =
        'This is an example text to test the preservation of many newline characters within the text.\nHere is a new line after many newline characters.';

      expect(actual).toEqual(expected);
    });

    test('Should replace many newline characters with a single one within text while preserving spaces and tabs', () => {
      const text =
        'This is an example text to test the preservation of many newline characters within the text while preserving spaces , tab\t and indentation.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nHere is a new line after many newline characters.';
      const actual = preserveNewlineIndentation(text);
      const expected =
        'This is an example text to test the preservation of many newline characters within the text while preserving spaces , tab\t and indentation.\nHere is a new line after many newline characters.';

      expect(actual).toEqual(expected);
    });

    test('Should replace multiple newline characters with a single one and remove all the spaces after the newline', () => {
      const text =
        'This is an example text to test the preservation of multiple newline characters within the text while removing all the spaces after the newline.\n     \n       \n          \n              \n   Here is a new line after multiple newline characters and spaces.';
      const actual = preserveNewlineIndentation(text);
      const expected =
        'This is an example text to test the preservation of multiple newline characters within the text while removing all the spaces after the newline.\nHere is a new line after multiple newline characters and spaces.';

      expect(actual).toEqual(expected);
    });

    test('Should return the text when no newline characters exist within text', () => {
      const text =
        'This is an example text to test that the text is returned when no newline characters exist within the text.';
      const actual = preserveNewlineIndentation(text);
      const expected = text;

      expect(actual).toEqual(expected);
    });
  });
});