import fs from 'fs';
import path from 'path';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { IBookHighlightsPluginSettings } from '../../../src/types';
import {
  extractKeepMeSectionFromContent,
  saveKeepMeSectionData,
  getKeepMeSectionDataFromSettings,
  embedKeepMeSectionDataIntoBookFile,
} from '../../../src/utils/manageKeepMeSection';

let settings: IBookHighlightsPluginSettings;

describe('manageKeepMeSection', () => {
  beforeEach(() => {
    settings = {
      highlightsFolder: 'ibooks-highlights',
      backup: false,
      importOnStart: false,
      highlightsSortingCriterion: 'creationDateOldToNew',
      template: 'template',
      filenameTemplate: 'filename',
      keepMeSectionOpeningDelimiter: '%% keep-me %%',
      keepMeSectionClosingDelimiter: '%% /keep-me %%',
      keepMeSectionData: {},
    };
  });

  describe('extractKeepMeSectionFromContent', () => {
    test('Should return matched content when Keep Me section is present between delimiters', () => {
      const bookWithKeepmeSection = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithKeepMeSection.md'), 'utf-8') //oxfmt-ignore

      const extractedKeepMeSection = extractKeepMeSectionFromContent(bookWithKeepmeSection, settings);

      expect(extractedKeepMeSection).toBe(
        'This is a great guide!📕 I learned so much from it.\nDefinitely need to recommend it to Aaron. 😎🤜🤛😎',
      );
    });

    test('Should return empty string when there is no Keep Me section between delimiters', () => {
      const bookWithoutKeepMeSection = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithEmptyKeepMeSection.md'), 'utf-8') //oxfmt-ignore

      const extractedKeepMeSection = extractKeepMeSectionFromContent(bookWithoutKeepMeSection, settings);

      expect(extractedKeepMeSection).toBe('');
    });

    test('Should return null when there are no Keep Me section delimiters in the content', () => {
      const bookWithNoKeepMeSectionDelimiters = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithNoKeepMeSectionDelimiters.md'), 'utf-8') //oxfmt-ignore

      const extractedKeepMeSection = extractKeepMeSectionFromContent(bookWithNoKeepMeSectionDelimiters, settings);

      expect(extractedKeepMeSection).toBeNull();
    });

    test('Should return null when one of the delimiters is missing but there is content that looks like a Keep Me section', () => {
      const bookWithOnlyStartDelimiter = fs.readFileSync(
        path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithOnlyStartDelimiter.md'),
        'utf-8',
      );
      const bookWithOnlyEndDelimiter = fs.readFileSync(
        path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithOnlyEndDelimiter.md'),
        'utf-8',
      );

      const extractedKeepMeSectionStart = extractKeepMeSectionFromContent(bookWithOnlyStartDelimiter, settings);
      const extractedKeepMeSectionEnd = extractKeepMeSectionFromContent(bookWithOnlyEndDelimiter, settings);

      expect(extractedKeepMeSectionStart).toBeNull();
      expect(extractedKeepMeSectionEnd).toBeNull();
    });

    test('Should return null when one of the Keep Me section delimiters is malformed', () => {
      const bookWithMalformedStartDelimiter = fs.readFileSync(
        path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithMalformedStartDelimiter.md'),
        'utf-8',
      );
      const bookWithMalformedEndDelimiter = fs.readFileSync(
        path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithMalformedEndDelimiter.md'),
        'utf-8',
      );

      const extractedKeepMeSectionMalformedStart = extractKeepMeSectionFromContent(bookWithMalformedStartDelimiter, settings);
      const extractedKeepMeSectionMalformedEnd = extractKeepMeSectionFromContent(bookWithMalformedEndDelimiter, settings);

      expect(extractedKeepMeSectionMalformedStart).toBeNull();
      expect(extractedKeepMeSectionMalformedEnd).toBeNull();
    });

    test('Should extract Markdown markup within the Keep Me section as is without alterations', () => {
      const bookWithDifferentMarkdownMarkupInKeepMeSection = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithMarkdownInKeepMeSection.md'), 'utf-8'); //oxfmt-ignore

      const extractedKeepMeSection = extractKeepMeSectionFromContent(bookWithDifferentMarkdownMarkupInKeepMeSection, settings);

      expect(extractedKeepMeSection).toBe(
        'This *is* a great **guide**!📕 I learned so much from it.\nDefinitely need to recommend it to `Aaron`. 😎🤜🤛😎\n\n> Blockquotes should also be preserved in the Keep Me section.\n\n- Lists should be preserved as well.\n- Like this.\n\n1. Numbered lists should be preserved.\n2. Like this.\n\n```js\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```\n\n```json\n{\n  "firstName": "John",\n  "lastName": "Galt",\n  "book": "Atlas Shrugged"\n}\n```\n\n[Link to plugin](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin)\n\nThis text is ~~strikethrough~~.\n\nThat is so funny! :joy:',
      );
    });

    test('Should extract HTML markup within the Keep Me section as is without alterations', () => {
      const bookWithHtmlMarkupInKeepMeSection = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithHtmlInKeepMeSection.md'), 'utf-8'); //oxfmt-ignore

      const extractedKeepMeSection = extractKeepMeSectionFromContent(bookWithHtmlMarkupInKeepMeSection, settings);

      expect(extractedKeepMeSection).toBe(
        '<p>This <em>is</em> a great <strong>guide</strong>!📕 I learned so much from it.\nDefinitely need to recommend it to <code>Aaron</code>. 😎🤜🤛😎</p>\n<blockquote>\n<p>Blockquotes should also be preserved in the Keep Me section.</p>\n</blockquote>\n<ul>\n<li>Lists should be preserved as well.</li>\n<li>Like this.</li>\n</ul>\n<ol>\n<li>Numbered lists should be preserved.</li>\n<li>Like this.</li>\n</ol>\n<pre><code class="language-js">function greet(name) {\n  return `Hello, ${name}!`;\n}\n</code></pre>\n<pre><code class="language-json">{\n  "firstName": "John",\n  "lastName": "Galt",\n  "book": "Atlas Shrugged"\n}\n</code></pre>\n<p><a href="https://github.com/bandantonio/obsidian-apple-books-highlights-plugin">Link to plugin</a></p>\n<p>This text is <del>strikethrough</del>.</p>\n<p>That is so funny! :joy:</p>',
      );
    });
  });

  describe('saveKeepMeSectionData', () => {
    const mockSaveData = vi.fn();

    afterEach(() => {
      vi.clearAllMocks();
    });

    test('Should check for Keep Me section when file is in highlights folder only', async () => {
      const fileMockOne = { path: 'ibooks-highlights/Book One.md', basename: 'Book One', parent: { path: 'ibooks-highlights' } };
      const fileMockTwo = {
        path: 'ibooks-highlights/Book Two-bk-1234567890.md',
        basename: 'Book Two-bk-1234567890',
        parent: { path: 'ibooks-highlights' },
      };
      const fileMockThree = { path: 'other-folder/Book Three.md', basename: 'Book Three', parent: { path: 'other-folder' } };
      const data = 'some content\n%% keep-me %%\nThis is a Keep Me section\n%% /keep-me %%\nmore content';

      await saveKeepMeSectionData(fileMockTwo as any, data, { saveData: mockSaveData } as any, settings);
      await saveKeepMeSectionData(fileMockThree as any, data, { saveData: mockSaveData } as any, settings);
      await saveKeepMeSectionData(fileMockOne as any, data, { saveData: mockSaveData } as any, settings);

      expect(mockSaveData).toHaveBeenCalledOnce();
      expect(mockSaveData).toHaveBeenCalledWith(
        expect.objectContaining({
          keepMeSectionData: expect.objectContaining({
            'Book One': 'This is a Keep Me section',
          }),
        }),
      );
    });

    test('Should save the Keep Me section content in plugin settings under keepMeSectionData with file basename as key', async () => {
      const fileMockOne = { path: 'ibooks-highlights/Book One.md', basename: 'Book One', parent: { path: 'ibooks-highlights' } };
      const fileMockTwo = { path: 'ibooks-highlights/Book Two.md', basename: 'Book Two', parent: { path: 'ibooks-highlights' } };
      const fileMockThree = { path: 'ibooks-highlights/Book Three.md', basename: 'Book Three', parent: { path: 'ibooks-highlights' } };

      const bookTwoWithKeepMeSection = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithKeepMeSection.md'), 'utf-8'); //oxfmt-ignore
      const bookTwoWithEmptyKeepMeSection = 'some content\n%% keep-me %%\n\n%% /keep-me %%\nmore content';
      const bookThreeWithKeepMeSection = 'some content\n%% keep-me %%\nThis is another Keep Me section\n%% /keep-me %%\nmore content';

      await saveKeepMeSectionData(fileMockOne as any, bookTwoWithKeepMeSection, { saveData: mockSaveData } as any, settings);
      await saveKeepMeSectionData(fileMockTwo as any, bookTwoWithEmptyKeepMeSection, { saveData: mockSaveData } as any, settings);
      await saveKeepMeSectionData(fileMockThree as any, bookThreeWithKeepMeSection, { saveData: mockSaveData } as any, settings);

      expect(mockSaveData).toHaveBeenCalledTimes(2);
      expect(mockSaveData).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          keepMeSectionData: expect.objectContaining({
            'Book One': 'This is a great guide!📕 I learned so much from it.\nDefinitely need to recommend it to Aaron. 😎🤜🤛😎',
          }),
        }),
      );
      expect(mockSaveData).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          keepMeSectionData: expect.objectContaining({
            'Book One': 'This is a great guide!📕 I learned so much from it.\nDefinitely need to recommend it to Aaron. 😎🤜🤛😎',
            'Book Three': 'This is another Keep Me section',
          }),
        }),
      );
    });

    test('Should save Markdown markup to settings as is without alterations', async () => {
      const fileMock = { path: 'ibooks-highlights/Book One.md', basename: 'Book One', parent: { path: 'ibooks-highlights' } };
      const data = fs.readFileSync(
        path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithMarkdownInKeepMeSection.md'),
        'utf-8',
      );

      await saveKeepMeSectionData(fileMock as any, data, { saveData: mockSaveData } as any, settings);

      expect(mockSaveData).toHaveBeenCalledOnce();
      expect(mockSaveData).toHaveBeenCalledWith(
        expect.objectContaining({
          keepMeSectionData: expect.objectContaining({
            'Book One':
              'This *is* a great **guide**!📕 I learned so much from it.\nDefinitely need to recommend it to `Aaron`. 😎🤜🤛😎\n\n> Blockquotes should also be preserved in the Keep Me section.\n\n- Lists should be preserved as well.\n- Like this.\n\n1. Numbered lists should be preserved.\n2. Like this.\n\n```js\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```\n\n```json\n{\n  "firstName": "John",\n  "lastName": "Galt",\n  "book": "Atlas Shrugged"\n}\n```\n\n[Link to plugin](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin)\n\nThis text is ~~strikethrough~~.\n\nThat is so funny! :joy:',
          }),
        }),
      );
    });

    test('Should initialize keepMeSectionData if undefined', async () => {
      const fileMock = { path: 'ibooks-highlights/Book Four.md', basename: 'Book Four', parent: { path: 'ibooks-highlights' } };
      const data = 'some content\n%% keep-me %%\nKeepMe section for Book Four\n%% /keep-me %%\nmore content';
      const settingsNoKeepMe: any = { ...settings };
      delete settingsNoKeepMe.keepMeSectionData;

      await saveKeepMeSectionData(fileMock as any, data, { saveData: mockSaveData } as any, settingsNoKeepMe);

      expect(settingsNoKeepMe.keepMeSectionData).toBeDefined();
      expect(settingsNoKeepMe.keepMeSectionData['Book Four']).toBe('KeepMe section for Book Four');
      expect(mockSaveData).toHaveBeenCalledWith(
        expect.objectContaining({
          keepMeSectionData: expect.objectContaining({
            'Book Four': 'KeepMe section for Book Four',
          }),
        }),
      );
    });

    test('Should save HTML markup to settings as is without alterations', async () => {
      const fileMock = { path: 'ibooks-highlights/Book One.md', basename: 'Book One', parent: { path: 'ibooks-highlights' } };
      const data = fs.readFileSync(
        path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithHtmlInKeepMeSection.md'),
        'utf-8',
      );

      await saveKeepMeSectionData(fileMock as any, data, { saveData: mockSaveData } as any, settings);

      expect(mockSaveData).toHaveBeenCalledOnce();
      expect(mockSaveData).toHaveBeenCalledWith(
        expect.objectContaining({
          keepMeSectionData: expect.objectContaining({
            'Book One':
              '<p>This <em>is</em> a great <strong>guide</strong>!📕 I learned so much from it.\nDefinitely need to recommend it to <code>Aaron</code>. 😎🤜🤛😎</p>\n<blockquote>\n<p>Blockquotes should also be preserved in the Keep Me section.</p>\n</blockquote>\n<ul>\n<li>Lists should be preserved as well.</li>\n<li>Like this.</li>\n</ul>\n<ol>\n<li>Numbered lists should be preserved.</li>\n<li>Like this.</li>\n</ol>\n<pre><code class="language-js">function greet(name) {\n  return `Hello, ${name}!`;\n}\n</code></pre>\n<pre><code class="language-json">{\n  "firstName": "John",\n  "lastName": "Galt",\n  "book": "Atlas Shrugged"\n}\n</code></pre>\n<p><a href="https://github.com/bandantonio/obsidian-apple-books-highlights-plugin">Link to plugin</a></p>\n<p>This text is <del>strikethrough</del>.</p>\n<p>That is so funny! :joy:</p>',
          }),
        }),
      );
    });

    test('Should delete keepMeSectionData entry if section is intentionally cleared', async () => {
      const fileMock = { path: 'ibooks-highlights/Book One.md', basename: 'Book One', parent: { path: 'ibooks-highlights' } };
      const data = 'some content\n%% keep-me %%\n\n%% /keep-me %%\nmore content';
      const settingsWithKeepMe = {
        ...settings,
        keepMeSectionData: { 'Book One': 'Old content' },
      };

      await saveKeepMeSectionData(fileMock as any, data, { saveData: mockSaveData } as any, settingsWithKeepMe);

      expect(mockSaveData).toHaveBeenCalledWith(
        expect.objectContaining({
          keepMeSectionData: expect.not.objectContaining({
            'Book One': expect.anything(),
          }),
        }),
      );
      expect(settingsWithKeepMe.keepMeSectionData['Book One']).toBeUndefined();
    });
  });

  describe('getKeepMeSectionDataFromSettings', () => {
    test('Should return the Keep Me section for the given filename from settings if it exists', () => {
      const settingsWithKeepMeSection = {
        ...settings,
        keepMeSectionData: {
          'Test Book': 'This is a Keep Me section for Test Book',
          'Another Book': 'This is a Keep Me section for Another Book',
        },
      };

      const keepMeSection = getKeepMeSectionDataFromSettings('Test Book', settingsWithKeepMeSection);

      expect(keepMeSection).toBe('This is a Keep Me section for Test Book');
    });

    test('Should return an empty string if there is no Keep Me section for the given filename in settings', () => {
      const settingsWithoutKeepMeSection = {
        ...settings,
        keepMeSectionData: {
          'Another Book': 'This is a Keep Me section for Another Book',
        },
      };

      const keepMeSection = getKeepMeSectionDataFromSettings('Test Book', settingsWithoutKeepMeSection);

      expect(keepMeSection).toBe('');
    });
  });

  describe('embedKeepMeSectionDataIntoBookFile', () => {
    test('Should replace existing Keep Me section content with the provided Keep Me section', () => {
      const keepMeSectionWithBasicMarkdown =
        'This is a very helpful guide 📕\nIt made my work with the iPhone so much easier! ☺️\n\nShould definitely recommend it to Aaron!';
      const keepMeSectionWithAdvancedMarkdown =
        'This *is* a great **guide**!📕 I learned so much from it.\nDefinitely need to recommend it to `Aaron`. 😎🤜🤛😎\n\n> Blockquotes should also be preserved in the Keep Me section.\n\n- Lists should be preserved as well.\n- Like this.\n\n1. Numbered lists should be preserved.\n2. Like this.\n\n```js\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```\n\n```json\n{\n  "firstName": "John",\n  "lastName": "Galt",\n  "book": "Atlas Shrugged"\n}\n```\n\n[Link to plugin](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin)\n\nThis text is ~~strikethrough~~.\n\nThat is so funny! :joy:\n';
      const keepMeSectionWithHtml =
        '<p>This <em>is</em> a great <strong>guide</strong>!📕 I learned so much from it.\nDefinitely need to recommend it to <code>Aaron</code>. 😎🤜🤛😎</p>\n<blockquote>\n<p>Blockquotes should also be preserved in the Keep Me section.</p>\n</blockquote>\n<ul>\n<li>Lists should be preserved as well.</li>\n<li>Like this.</li>\n</ul>\n<ol>\n<li>Numbered lists should be preserved.</li>\n<li>Like this.</li>\n</ol>\n<pre><code class="language-js">function greet(name) {\n  return `Hello, ${name}!`;\n}\n</code></pre>\n<pre><code class="language-json">{\n  "firstName": "John",\n  "lastName": "Galt",\n  "book": "Atlas Shrugged"\n}\n</code></pre>\n<p><a href="https://github.com/bandantonio/obsidian-apple-books-highlights-plugin">Link to plugin</a></p>\n<p>This text is <del>strikethrough</del>.</p>\n<p>That is so funny! :joy:</p>\n';

      const preCompiledContent = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'preCompiledBookContentWithKeepMeSectionDelimiters.md'), 'utf-8') //oxfmt-ignore

      const expectedCompiledContentWithBasicMarkdown = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'compiledBookContentWithKeepMeSectionDelimiters.md'), 'utf-8') //oxfmt-ignore
      const expectedCompiledContentWithAdvancedMarkdown = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithMarkdownInKeepMeSection.md'), 'utf-8') //oxfmt-ignore
      const expectedCompiledContentWithHtml = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'manageKeepMeSection', 'bookOneWithHtmlInKeepMeSection.md'), 'utf-8') //oxfmt-ignore

      const compiledContentWithBasicMarkdown = embedKeepMeSectionDataIntoBookFile(
        keepMeSectionWithBasicMarkdown,
        preCompiledContent,
        settings,
      );
      const compiledContentWithAdvancedMarkdown = embedKeepMeSectionDataIntoBookFile(
        keepMeSectionWithAdvancedMarkdown,
        preCompiledContent,
        settings,
      );
      const compiledContentWithHtml = embedKeepMeSectionDataIntoBookFile(keepMeSectionWithHtml, preCompiledContent, settings);

      expect(compiledContentWithBasicMarkdown).toBe(expectedCompiledContentWithBasicMarkdown);
      expect(compiledContentWithAdvancedMarkdown).toBe(expectedCompiledContentWithAdvancedMarkdown);
      expect(compiledContentWithHtml).toBe(expectedCompiledContentWithHtml);
    });

    test('Should embed Keep Me section containing $ and $1 verbatim', () => {
      const keepMeSectionWithDollar = 'This is a $dollar and $1 and $$ and $& test.';
      const contentWithSection = `${settings.keepMeSectionOpeningDelimiter}\nold content\n${settings.keepMeSectionClosingDelimiter}`;
      const expected = `${settings.keepMeSectionOpeningDelimiter}\n${keepMeSectionWithDollar}\n${settings.keepMeSectionClosingDelimiter}`;

      const result = embedKeepMeSectionDataIntoBookFile(keepMeSectionWithDollar, contentWithSection, settings);
      expect(result).toBe(expected);
    });
  });

  test.todo('Should preserve the Keep Me section content if the book file is deleted and re-imported again');
});
