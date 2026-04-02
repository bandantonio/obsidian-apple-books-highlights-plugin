import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';
import { compileTemplate } from '../../../src/modules/templateProcessing';
import aggregatedBooksAndAnnotations from '../../fixtures/annotationProcessing/aggregatedBooksAndAnnotations.json' with { type: 'json' };

describe('templateProcessing', () => {
  test('Should compile a raw template with all the variables passed to it', () => {
    const template = '📕 {{{bookTitle}}} by {{{bookAuthor}}}';
    const contentToCompile = {
      bookTitle: 'Mac User Guide',
      bookAuthor: 'Apple Inc.',
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual('📕 Mac User Guide by Apple Inc.');
  });

  test('Should compile a raw template with all the available filename variables', async () => {
    const template = '📕 {{{bookTitle}}} - 🆔 {{{bookId}}} - 👤 {{{bookAuthor}}} - 📚 {{{bookGenre}}} - 🌎 {{{bookLanguage}}}';
    const contentToCompile = {
      bookTitle: 'Mac User Guide',
      bookId: '12345',
      bookAuthor: 'Apple Inc.',
      bookGenre: 'Technology',
      bookLanguage: 'EN',
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual('📕 Mac User Guide - 🆔 12345 - 👤 Apple Inc. - 📚 Technology - 🌎 EN');
  });

  test('Should compile an html-escaped template for variables wrapped in double curly braces', () => {
    const template = '📕 {{bookTitle}} by {{bookAuthor}}';
    const contentToCompile = {
      bookTitle: 'Mac <User> Guide',
      bookAuthor: 'Apple & Co.',
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual('📕 Mac &lt;User&gt; Guide by Apple &amp; Co.');
  });

  test('Should compile a raw template and leave empty string for missing variables', () => {
    const template = '📕 {{{title}}}';
    const contentToCompile = {
      bookTitle: 'Test Book',
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual('📕 ');
  });

  test(`Should compile a raw template and render plain variable if it wasn't wrapped in curly braces`, () => {
    const template = '📕 {{{bookTitle}}} - bookAuthor';
    const contentToCompile = {
      bookTitle: 'Test Book',
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual('📕 Test Book - bookAuthor');
  });

  test('Should compile a raw template and leave empty string for non-existing variables', () => {
    const template = '📕 {{{title}}}';
    const contentToCompile = {
      bookTitle: 'Test Book',
      nonExistingVariable: 'This text should not be rendered',
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual('📕 ');
  });

  test('Should compile several books with annotations with a raw default template', () => {
    const defaultTemplate = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'defaultTemplate.md'), 'utf-8'); //oxfmt-ignore
    const renderedBookOne = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsOne-default.md'), 'utf-8'); // oxfmt-ignore
    const renderedBookTwo = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsTwo-default.md'), 'utf-8'); // oxfmt-ignore
    const renderedBookThree = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsThree-default.md'), 'utf-8'); // oxfmt-ignore
    const renderedBookFour = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsFour-default.md'), 'utf-8'); // oxfmt-ignore

    const preCompiledTemplate = compileTemplate(defaultTemplate);

    const compiledContentForBookOne = preCompiledTemplate(aggregatedBooksAndAnnotations[0]);
    const compiledContentForBookTwo = preCompiledTemplate(aggregatedBooksAndAnnotations[1]);
    const compiledContentForBookThree = preCompiledTemplate(aggregatedBooksAndAnnotations[2]);
    const compiledContentForBookFour = preCompiledTemplate(aggregatedBooksAndAnnotations[3]);

    expect(compiledContentForBookOne).toEqual(renderedBookOne);
    expect(compiledContentForBookTwo).toEqual(renderedBookTwo);
    expect(compiledContentForBookThree).toEqual(renderedBookThree);
    expect(compiledContentForBookFour).toEqual(renderedBookFour);
  });

  test('Should compile a custom template and preserve newlines', () => {
    const customTemplate = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'customTemplateWithPreservedNewlines.md'), 'utf-8'); //oxfmt-ignore
    const renderedTemplateWithPreservedNewlines = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedTemplateWithPreservedNewlines.md'), 'utf-8'); //oxfmt-ignore

    const modifiedBookOne = {
      bookId: 'THBFYNJKTGFTTVCGSAE1',
      bookTitle: 'iPhone User Guide',
      bookAuthor: 'Apple Inc.',
      annotations: [
        {
          highlight:
            'custom modified highlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation\nand another new line\nto check one more time',
        },
      ],
    };

    const preCompiledTemplate = compileTemplate(customTemplate);

    const compiledContent = preCompiledTemplate(modifiedBookOne);
    expect(compiledContent).toEqual(renderedTemplateWithPreservedNewlines);
  });
});

describe('Handlebars helpers', () => {
  const helpers = Handlebars.helpers;

  describe('Custom Handlebars helpers', () => {
    describe('eq', () => {
      test('Should be registered', () => {
        expect(helpers.eq).toBeDefined();
      });

      test('Should properly compare two values', () => {
        expect(helpers.eq(1, '1')).toBeTruthy();
        expect(helpers.eq(1, '2')).toBeFalsy();
      });
    });

    describe('dateFormat', () => {
      dayjs.extend(utc);
      dayjs.extend(timezone);

      test('Should be registered', () => {
        expect(helpers.dateFormat).toBeDefined();
      });

      test('Should properly calculate and format date for UTC timezone', () => {
        // Defaults to UTC when timezone is not guessed
        vi.spyOn(dayjs.tz, 'guess').mockReturnValue('');

        expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-26 10:41:22 PM +00:00');
        expect(helpers.dateFormat(726187452.01369, 'ddd, MMM DD YYYY, HH:mm:ss Z')).toEqual('Fri, Jan 05 2024, 22:44:12 +00:00');
        expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Monday, March 11, 2024 at 07:04 PM');
      });

      test('Should properly calculate and format date for Pacific timezone', () => {
        vi.spyOn(dayjs.tz, 'guess').mockReturnValue('Canada/Pacific');

        expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-26 03:41:22 PM -07:00');
        expect(helpers.dateFormat(726187452.01369, 'ddd, MMM DD YYYY, hh:mm:ss Z')).toEqual('Fri, Jan 05 2024, 02:44:12 -08:00');
        expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Monday, March 11, 2024 at 12:04 PM');
      });

      test('Should properly calculate and format date for Australia/Sydney timezone', () => {
        vi.spyOn(dayjs.tz, 'guess').mockReturnValue('Australia/Sydney');

        expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-27 08:41:22 AM +10:00');
        expect(helpers.dateFormat(726187452.01369, 'ddd, MMM DD YYYY, hh:mm:ss Z')).toEqual('Sat, Jan 06 2024, 09:44:12 +11:00');
        expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Tuesday, March 12, 2024 at 06:04 AM');
      });
    });
  });
});

describe('Custom template with date formatting', () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  test('Should compile a custom raw template with custom date formtting', () => {
    vi.spyOn(dayjs.tz, 'guess').mockReturnValue('America/New_York');

    const template = `- 📝 Note:: {{#if note}}{{{note}}}{{else}}N/A{{/if}}
    - 📙 Highlight Link:: {{#if highlightLocation}}[Apple Books Highlight Link](ibooks://assetid/{{../bookId}}#{{highlightLocation}}){{else}}N/A{{/if}}
    - <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>
    - <small>📅 Highlight modified on:: {{dateFormat highlightModificationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>`;

    const contentToCompile = {
      note: 'Test note',
      highlightCreationDate: 743629925.898202,
      highlightModificationDate: 743640744.124985,
    };

    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual(`- 📝 Note:: Test note
    - 📙 Highlight Link:: N/A
    - <small>📅 Highlight taken on:: 2024-07-25 03:52:05 PM -04:00</small>
    - <small>📅 Highlight modified on:: 2024-07-25 06:52:24 PM -04:00</small>`);
  });

  test('Should compile several books with annotations with a raw default template with colored background for highlights', () => {
    vi.spyOn(dayjs.tz, 'guess').mockReturnValue('Canada/Pacific');

    const defaultTemplate = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'customTemplate.md'), 'utf-8'); //oxfmt-ignore
    const renderedBookOne = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsOne-custom.md'), 'utf-8'); // oxfmt-ignore
    const renderedBookTwo = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsTwo-custom.md'), 'utf-8'); // oxfmt-ignore
    const renderedBookThree = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsThree-custom.md'), 'utf-8'); // oxfmt-ignore
    const renderedBookFour = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsFour-custom.md'), 'utf-8'); // oxfmt-ignore

    const preCompiledTemplate = compileTemplate(defaultTemplate);

    const compiledContentForBookOne = preCompiledTemplate(aggregatedBooksAndAnnotations[0]);
    const compiledContentForBookTwo = preCompiledTemplate(aggregatedBooksAndAnnotations[1]);
    const compiledContentForBookThree = preCompiledTemplate(aggregatedBooksAndAnnotations[2]);
    const compiledContentForBookFour = preCompiledTemplate(aggregatedBooksAndAnnotations[3]);

    expect(compiledContentForBookOne).toEqual(renderedBookOne);
    expect(compiledContentForBookTwo).toEqual(renderedBookTwo);
    expect(compiledContentForBookThree).toEqual(renderedBookThree);
    expect(compiledContentForBookFour).toEqual(renderedBookFour);
  });

  test('Should properly calculate and format date for UTC timezone', () => {
    vi.spyOn(dayjs.tz, 'guess').mockReturnValue('');

    const formatsToTest = [
      { date: 683246482.042544, format: 'YYYY-MM-DD hh:mm:ss A Z', expected: '2022-08-26 10:41:22 PM +00:00' },
      { date: 726187452.01369, format: 'ddd, MMM DD YYYY, HH:mm:ss Z', expected: 'Fri, Jan 05 2024, 22:44:12 +00:00' },
      { date: 731876693.002279, format: 'dddd, MMMM D, YYYY [at] hh:mm A', expected: 'Monday, March 11, 2024 at 07:04 PM' },
    ];

    formatsToTest.forEach(({ date, format, expected }) => {
      const template = `- <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "${format}"}}</small>`;
      const contentToCompile = {
        highlightCreationDate: date,
      };

      const preCompiledTemplate = compileTemplate(template);
      const compiledContent = preCompiledTemplate(contentToCompile);
      expect(compiledContent).toEqual(`- <small>📅 Highlight taken on:: ${expected}</small>`);
    });
  });

  test('Should properly calculate and format date for Pacific timezone', () => {
    vi.spyOn(dayjs.tz, 'guess').mockReturnValue('Canada/Pacific');

    const formatsToTest = [
      { date: 683246482.042544, format: 'YYYY-MM-DD hh:mm:ss A Z', expected: '2022-08-26 03:41:22 PM -07:00' },
      { date: 726187452.01369, format: 'ddd, MMM DD YYYY, hh:mm:ss Z', expected: 'Fri, Jan 05 2024, 02:44:12 -08:00' },
      { date: 731876693.002279, format: 'dddd, MMMM D, YYYY [at] hh:mm A', expected: 'Monday, March 11, 2024 at 12:04 PM' },
    ];

    formatsToTest.forEach(({ date, format, expected }) => {
      const template = `- <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "${format}"}}</small>`;
      const contentToCompile = {
        highlightCreationDate: date,
      };

      const preCompiledTemplate = compileTemplate(template);
      const compiledContent = preCompiledTemplate(contentToCompile);
      expect(compiledContent).toEqual(`- <small>📅 Highlight taken on:: ${expected}</small>`);
    });
  });
});
