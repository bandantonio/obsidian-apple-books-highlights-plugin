import fs from 'fs/promises';
import path from 'path';
import { describe, expect, test } from 'vitest';

describe('Plugin documentation', () => {
	test('Check that README.md exists', () => {
		expect(path.join(process.cwd(), 'README.md')).toBeDefined();
	});

	test('Check that Template variables contains complete list of variables', async () => {
		const docsTemplateVariablesPage = await fs.readFile(path.join(process.cwd(), 'docs', 'customization', 'templates-and-variables.md'), 'utf-8');

		expect(docsTemplateVariablesPage).toContain('{{{bookTitle}}}');
		expect(docsTemplateVariablesPage).toContain('{{bookId}}');
		expect(docsTemplateVariablesPage).toContain('{{{bookAuthor}}}');
		expect(docsTemplateVariablesPage).toContain('{{{bookGenre}}}');
		expect(docsTemplateVariablesPage).toContain('{{bookLanguage}}');
		expect(docsTemplateVariablesPage).toContain('{{bookLastOpenedDate}}');
		expect(docsTemplateVariablesPage).toContain('{{bookCoverUrl}}');
		expect(docsTemplateVariablesPage).toContain('{{annotations}}');
		expect(docsTemplateVariablesPage).toContain('{{annotations.length}}');
		expect(docsTemplateVariablesPage).toContain('{{{chapter}}}');
		expect(docsTemplateVariablesPage).toContain('{{{contextualText}}}');
		expect(docsTemplateVariablesPage).toContain('{{{highlight}}}');
		expect(docsTemplateVariablesPage).toContain('{{{note}}}');
		expect(docsTemplateVariablesPage).toContain('{{{highlightLocation}}}');
		expect(docsTemplateVariablesPage).toContain('{{highlightStyle}}');
		expect(docsTemplateVariablesPage).toContain('{{highlightCreationDate}}');
		expect(docsTemplateVariablesPage).toContain('{{highlightModificationDate}}');
	});
});
