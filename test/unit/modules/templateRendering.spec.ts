import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Handlebars from 'handlebars';
import { describe, expect, test, vi } from 'vitest';
import { compileTemplate } from '../../../src/modules/templateProcessing';
import { aggregatedBooksAndAnnotations } from '../../mocks/aggregatedBooksAndAnnotations';
import { defaultTemplateWithAnnotations } from '../../mocks/renderedTemplate';
import { defaultTemplate } from '../../../src/settings';

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
  
  test('Should compile a raw template when passing several books with annotations', () => {
    aggregatedBooksAndAnnotations.forEach((bookWithAnnotations, index) => {
      const preCompiledTemplate = compileTemplate(defaultTemplate);
      const compiledContent = preCompiledTemplate(bookWithAnnotations);
      
      expect(compiledContent).toEqual(defaultTemplateWithAnnotations[index]);
    });
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
  
  test('Should compile a custom raw template with colored background for highlights', () => {
    const template = `Title:: 📕 {{{bookTitle}}}
Author:: {{{bookAuthor}}}

{{#each annotations}}
----
{{#if (eq highlightStyle "0")}}- 🎯 Highlight:: <u>{{{highlight}}}</u>
{{else if (eq highlightStyle "1")}}- 🎯 Highlight:: <mark style="background:rgb(175,213,151); color:#000; padding:2px;">{{{highlight}}}</mark>
{{else if (eq highlightStyle "2")}}- 🎯 Highlight:: <mark style="background:rgb(181,205,238); color:#000; padding:2px;">{{{highlight}}}</mark>
{{else if (eq highlightStyle "3")}}- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">{{{highlight}}}</mark>
{{/if}}
{{/each}}

`;
    
    const contentToCompile = {
      bookTitle: 'Test Book',
      bookAuthor: 'Test Author',
      annotations: [
        { highlight: 'Highlight 1', highlightStyle: '0' },
        { highlight: 'Highlight 2', highlightStyle: '1' },
        { highlight: 'Highlight 3', highlightStyle: '2' },
        { highlight: 'Highlight 4', highlightStyle: '3' },
      ],
    };
    
    const preCompiledTemplate = compileTemplate(template);
    const compiledContent = preCompiledTemplate(contentToCompile);
    expect(compiledContent).toEqual(`Title:: 📕 Test Book
Author:: Test Author

----
- 🎯 Highlight:: <u>Highlight 1</u>
----
- 🎯 Highlight:: <mark style="background:rgb(175,213,151); color:#000; padding:2px;">Highlight 2</mark>
----
- 🎯 Highlight:: <mark style="background:rgb(181,205,238); color:#000; padding:2px;">Highlight 3</mark>
----
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">Highlight 4</mark>

`);
  });
});

describe('Handlebars helpers', () => {
  const helpers = Handlebars.helpers;

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const tzSpy = vi.spyOn(dayjs.tz, 'guess');
  
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

    // biome-ignore-start lint/style/noMagicNumbers: Number values are explicitly described in 'toEqual' part
    describe('dateFormat', () => {
      test('Should be registered', () => {
        expect(helpers.dateFormat).toBeDefined();
      });

      test('Should properly calculate and format date for UTC timezone', () => {
        // Defaults to UTC when timezone is not guessed
        tzSpy.mockImplementation(() => '');

        expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-26 10:41:22 PM +00:00');
        expect(helpers.dateFormat(726187452.01369, 'ddd, MMM DD YYYY, HH:mm:ss Z')).toEqual('Fri, Jan 05 2024, 22:44:12 +00:00');
        expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Monday, March 11, 2024 at 07:04 PM');
      });

      test('Should properly calculate and format date for Pacific timezone', () => {
        tzSpy.mockImplementation(() => 'Canada/Pacific');

        expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-26 03:41:22 PM -07:00');
        expect(helpers.dateFormat(726187452.01369, 'ddd, MMM DD YYYY, hh:mm:ss Z')).toEqual('Fri, Jan 05 2024, 02:44:12 -08:00');
        expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Monday, March 11, 2024 at 12:04 PM');
      });

      test('Should properly calculate and format date for Australia/Sydney timezone', () => {
        tzSpy.mockImplementation(() => 'Australia/Sydney');

        expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-27 08:41:22 AM +10:00');
        expect(helpers.dateFormat(726187452.01369, 'ddd, MMM DD YYYY, hh:mm:ss Z')).toEqual('Sat, Jan 06 2024, 09:44:12 +11:00');
        expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Tuesday, March 12, 2024 at 06:04 AM');
      });
    });
    // biome-ignore-end lint/style/noMagicNumbers: Number values are explicitly described in 'toEqual' part
  });
});

  // describe('Custom template with date formatting', () => {
  //   dayjs.extend(utc);
  //   dayjs.extend(timezone);
  //   const tzSpy = vi.spyOn(dayjs.tz, 'guess');
    
  //   test('Should compile a custom raw template with custom date formtting', () => {
  //     tzSpy.mockImplementation(() => 'America/New_York');
    
  //     const template = `- 📝 Note:: {{#if note}}{{{note}}}{{else}}N/A{{/if}}
  //     - 📙 Highlight Link:: {{#if highlightLocation}}[Apple Books Highlight Link](ibooks://assetid/{{../bookId}}#{{highlightLocation}}){{else}}N/A{{/if}}
  //     - <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>
  //     - <small>📅 Highlight modified on:: {{dateFormat highlightModificationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>`;
    
  //     const contentToCompile = {
  //       note: 'Test note',
  //       highlightCreationDate: 743629925.898202,
  //       highlightModificationDate: 743640744.124985,
  //     };
    
  //     const preCompiledTemplate = compileTemplate(template);
  //     const compiledContent = preCompiledTemplate(contentToCompile);
  //     expect(compiledContent).toEqual(`- 📝 Note:: Test note
  //     - 📙 Highlight Link:: N/A
  //     - <small>📅 Highlight taken on:: 2024-07-25 03:52:05 PM -04:00</small>
  //     - <small>📅 Highlight modified on:: 2024-07-25 06:52:24 PM -04:00</small>`);
  //   });
    
  //   test('Should properly calculate and format date for UTC timezone', () => {
  //     tzSpy.mockImplementation(() => '');

  //     const formatsToTest = [
  //       { date: 683246482.042544, format: 'YYYY-MM-DD hh:mm:ss A Z', expected: '2022-08-26 10:41:22 PM +00:00' },
  //       { date: 726187452.01369, format: 'ddd, MMM DD YYYY, HH:mm:ss Z', expected: 'Fri, Jan 05 2024, 22:44:12 +00:00' },
  //       { date: 731876693.002279, format: 'dddd, MMMM D, YYYY [at] hh:mm A', expected: 'Monday, March 11, 2024 at 07:04 PM' },
  //     ];

  //     formatsToTest.forEach(({ date, format, expected }) => {
  //       const template = `- <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "${format}"}}</small>`;
  //       const contentToCompile = {
  //         highlightCreationDate: date,
  //       };

  //       const preCompiledTemplate = compileTemplate(template);
  //       const compiledContent = preCompiledTemplate(contentToCompile);
  //       expect(compiledContent).toEqual(`- <small>📅 Highlight taken on:: ${expected}</small>`);
  //     });
  //   });
    
  //   test('Should properly calculate and format date for Pacific timezone', () => {
  //     tzSpy.mockImplementation(() => 'Canada/Pacific');
      
  //     const formatsToTest = [
  //       { date: 683246482.042544, format: 'YYYY-MM-DD hh:mm:ss A Z', expected: '2022-08-26 03:41:22 PM -07:00' },
  //       { date: 726187452.01369, format: 'ddd, MMM DD YYYY, hh:mm:ss Z', expected: 'Fri, Jan 05 2024, 02:44:12 -08:00' },
  //       { date: 731876693.002279, format: 'dddd, MMMM D, YYYY [at] hh:mm A', expected: 'Monday, March 11, 2024 at 12:04 PM' },
  //     ];

  //     formatsToTest.forEach(({ date, format, expected }) => {
  //       const template = `- <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "${format}"}}</small>`;
  //       const contentToCompile = {
  //         highlightCreationDate: date,
  //       };

  //       const preCompiledTemplate = compileTemplate(template);
  //       const compiledContent = preCompiledTemplate(contentToCompile);
  //       expect(compiledContent).toEqual(`- <small>📅 Highlight taken on:: ${expected}</small>`);
  //     });
  //   });
  // });
  
// });