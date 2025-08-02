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

		describe('contextBefore & contextAfter', () => {
			test('Should be registered', () => {
				expect(helpers.contextBefore).toBeDefined();
				expect(helpers.contextAfter).toBeDefined();
			});

			test('Should find the text before and after when it exists', () => {
				const highlight = 'the thing I highlighted';
				const contextualText = 'Something before the thing I highlighted, and something after.';
				expect(helpers.contextBefore(highlight, contextualText)).toEqual('Something before ');
				expect(helpers.contextAfter(highlight, contextualText)).toEqual(', and something after.');
			});

			test('Should return empty string when the contextualText and highlight are equal', () => {
				const highlight = 'The thing I higlighted is the entire sentence.';
				const contextualText = 'The thing I higlighted is the entire sentence.';
				expect(helpers.contextBefore(highlight, contextualText)).toEqual('');
				expect(helpers.contextAfter(highlight, contextualText)).toEqual('');
			});

			test('Should return null when the contextualText does not contain highlight', () => {
				const highlight = 'does not occur';
				const contextualText = 'The quick brown fox jumps over the lazy dog.';
				expect(helpers.contextBefore(highlight, contextualText)).toBeNull();
				expect(helpers.contextAfter(highlight, contextualText)).toBeNull();
			});
		});
	});
});
