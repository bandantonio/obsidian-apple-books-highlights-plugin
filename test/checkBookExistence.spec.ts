import { checkBookExistence } from '../src/utils/checkBookExistence';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('checkBookExistence', () => {
    const mockVault = {
        getFileByPath: vi.fn(),
    };

    const settings = new AppleBooksHighlightsImportPluginSettings();

    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('Should return false if the book file does not exist', () => {
        const bookTitle = 'Hello World';
        mockVault.getFileByPath.mockReturnValue(null);

        const checkResult = checkBookExistence(bookTitle, mockVault as any, settings);

        expect(checkResult).toBe(false);
    });

    test('Should return true if the book file exists', () => {
        const bookTitle = 'Hello World';
        mockVault.getFileByPath.mockReturnValue({ path: `${settings.highlightsFolder}/${bookTitle}.md` });

        const checkResult = checkBookExistence(bookTitle, mockVault as any, settings);

        expect(checkResult).toBe(true);
    });
});
