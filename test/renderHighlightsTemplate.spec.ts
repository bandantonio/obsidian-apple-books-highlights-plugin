import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Handlebars from 'handlebars';
import { describe, expect, test, vi } from 'vitest';
import { renderHighlightsTemplate } from '../src/methods/renderHighlightsTemplate';
import { aggregatedHighlightsWithDefaultSorting } from './mocks/aggregatedDetailsData';
import { rawCustomTemplateMock, rawCustomTemplateMockWithWrappedTextBlockContainingNewlines } from './mocks/rawTemplates';
import { defaultTemplateMockWithAnnotationsSortedByDefault, renderedCustomTemplateMockWithDefaultSorting, renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines } from './mocks/renderedTemplate';
import defaultTemplate from '../src/template';
import { ICombinedBooksAndHighlights } from 'src/types';

describe('renderHighlightsTemplate', () => {
	const helpers = Handlebars.helpers;

	dayjs.extend(utc);
	dayjs.extend(timezone);
	const tzSpy = vi.spyOn(dayjs.tz, 'guess');

	describe('Template rendering', () => {
		test('Should render a default template with the provided data', async () => {
			const renderedTemplate = await renderHighlightsTemplate(aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights, defaultTemplate);

			expect(renderedTemplate).toEqual(defaultTemplateMockWithAnnotationsSortedByDefault);
		});

		test('Should render a custom template with the provided data', async () => {
			tzSpy.mockImplementation(() => 'America/New_York');

			const renderedTemplate = await renderHighlightsTemplate(aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights, rawCustomTemplateMock);

			expect(renderedTemplate).toEqual(renderedCustomTemplateMockWithDefaultSorting);
		});

		test('Should render a custom template with the provided data and preserve newlines in wrapped text blocks', async () => {
			const renderedTemplate = await renderHighlightsTemplate(aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights, rawCustomTemplateMockWithWrappedTextBlockContainingNewlines);

			expect(renderedTemplate).toEqual(renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines);
		});
	});

	describe('Custom Handlebars helpers', () => {
		describe('eq', () => {
			test('Should be registered', () => {
				expect(helpers.eq).toBeDefined();
			});

			test('Should properly compare two values', async () => {
				expect(helpers.eq(1, '1')).toBeTruthy();
				expect(helpers.eq(1, '2')).toBeFalsy();
			});
		});

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
	});
});

describe('renderFilenameTemplate', () => {
	test('Should render book title as a default filename for highlights', async () => {
		const renderedNamingTemplate = await renderHighlightsTemplate(
			aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights,
			`{{{bookTitle}}}`
		);
		expect(renderedNamingTemplate).toEqual('Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title');
	});
	
	test('Should render all the available variables as a filename for highlights', async () => {
		const renderedNamingTemplate = await renderHighlightsTemplate(
			aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights,
			`{{{bookTitle}}} - {{{bookId}}} - {{{bookAuthor}}} - {{{bookGenre}}} - {{{bookLanguage}}}`
		);
		expect(renderedNamingTemplate).toEqual('Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title - THBFYNJKTGFTTVCGSAE5 - Apple Inc. - Technology - EN');
	});

	test('Should render book title and author as a filename for highlights', async () => {
		const renderedNamingTemplate = await renderHighlightsTemplate(
			aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights,
			`{{{bookTitle}}} by {{{bookAuthor}}}`
		);
		expect(renderedNamingTemplate).toEqual('Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc.');
	});

	test('Should render book title and author with emojis as a filename for highlights', async () => {
		const renderedNamingTemplate = await renderHighlightsTemplate(
			aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights,
			`📕 {{{bookTitle}}} by 👤 {{{bookAuthor}}}`
		);
		expect(renderedNamingTemplate).toEqual('📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by 👤 Apple Inc.');
	});
	
	test('Should skip rendering of non-existing variables in filename template', async () => {
		const renderedNamingTemplate = await renderHighlightsTemplate(
			aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights,
			`{{{bookAuthor}}} - {{{nonExistingVariable}}}`
		);
		expect(renderedNamingTemplate).toEqual('Apple Inc. - ');
	});
	
	test(`Should render plain variable if it wasn't wrapped in curly braces`, async () => {
		const renderedNamingTemplate = await renderHighlightsTemplate(
			aggregatedHighlightsWithDefaultSorting[0] as ICombinedBooksAndHighlights,
			`{{bookAuthor}} - bookTitle`
		);
		expect(renderedNamingTemplate).toEqual('Apple Inc. - bookTitle');
	})
});