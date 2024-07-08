import fs from 'fs/promises';
import path from 'path';
import { describe, expect, test } from 'vitest';

describe('Plugin documentation', () => {
	test('Check that README.md exists', () => {
		expect(path.join(process.cwd(), 'README.md')).toBeDefined();
	});

	test('Check that Template variables contains complete list of variables', async () => {
		const readme = await fs.readFile(path.join(process.cwd(), 'README.md'), 'utf-8');

		expect(readme).toContain('{{{bookTitle}}}');
		expect(readme).toContain('{{bookId}}');
		expect(readme).toContain('{{{bookAuthor}}}');
		expect(readme).toContain('{{{bookGenre}}}');
		expect(readme).toContain('{{bookLanguage}}');
		expect(readme).toContain('{{bookLastOpenedDate}}');
		expect(readme).toContain('{{bookCoverUrl}}');
		expect(readme).toContain('{{annotations}}');
		expect(readme).toContain('{{annotations.length}}');
		expect(readme).toContain('{{{chapter}}}');
		expect(readme).toContain('{{{contextualText}}}');
		expect(readme).toContain('{{{highlight}}}');
		expect(readme).toContain('{{{note}}}');
		expect(readme).toContain('{{{highlightLocation}}}');
		expect(readme).toContain('{{highlightStyle}}');
		expect(readme).toContain('{{highlightCreationDate}}');
		expect(readme).toContain('{{highlightModificationDate}}');
	});
});
