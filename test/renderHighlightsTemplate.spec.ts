import Handlebars from 'handlebars';
import { describe, expect, test } from 'vitest';
import { renderHighlightsTemplate } from '../src/methods/renderHighlightsTemplate';
import { aggregatedHighlights } from './mocks/aggregatedDetailsData';
import { rawCustomTemplateMock } from './mocks/rawTemplates';
import { defaultTemplateMock, renderedCustomTemplateMock } from './mocks/renderedTemplate';
import defaultTemplate from '../src/template';

describe('renderHighlightsTemplate', () => {
	test('Should render a default template with the provided data', async () => {
		const renderedTemplate = await renderHighlightsTemplate(aggregatedHighlights[0], defaultTemplate);

		expect(renderedTemplate).toEqual(defaultTemplateMock);
	});

	test('Should render a custom template with the provided data', async () => {
		const renderedTemplate = await renderHighlightsTemplate(aggregatedHighlights[0], rawCustomTemplateMock);

		expect(renderedTemplate).toEqual(renderedCustomTemplateMock);
	});
});

describe('Custom Handlebars helpers', () => {
	const helpers = Handlebars.helpers;

	describe('eq', () => {
		test('Should properly compare two values', async () => {
			expect(helpers.eq).toBeDefined();

			expect(helpers.eq(1, '1')).toBeTruthy();
			expect(helpers.eq(1, '2')).toBeFalsy();
		});
	});

	describe('dateFormat', () => {
		test('Should properly calculate and format a date', async () => {
			expect(helpers.dateFormat).toBeDefined();

			expect(helpers.dateFormat(683246482.042544, 'YYYY-MM-DD hh:mm:ss A Z')).toEqual('2022-08-26 11:41:22 PM +03:00');
			expect(helpers.dateFormat(726187452.01369, "ddd, MMM DD YYYY, HH:mm:ss Z")).toEqual("Fri, Jan 05 2024, 22:44:12 +02:00");
			expect(helpers.dateFormat(731876693.002279, 'dddd, MMMM D, YYYY [at] hh:mm A')).toEqual('Monday, March 11, 2024 at 07:04 PM');
		});
	});
});
