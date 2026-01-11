import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import type { ICombinedBooksAndHighlights } from '../src/types';
import { checkBookExistence } from '../src/utils/checkBookExistence';
import { aggregatedUnsortedHighlights } from './mocks/aggregatedDetailsData';

describe('checkBookExistence', () => {
  const mockVault = {
    getFileByPath: vi.fn(),
  };

  const settings = new AppleBooksHighlightsImportPluginSettings();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Should return false if the book file does not exist', async () => {
    const item = aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights;

    mockVault.getFileByPath.mockReturnValue(null);

    const checkResult = await checkBookExistence(item, mockVault as any, settings);

    expect(checkResult).toBe(false);
  });

  test('Should return true if the book file exists', async () => {
    const item = aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights;

    mockVault.getFileByPath.mockReturnValue({ path: `${settings.highlightsFolder}/Hello World.md` });

    const checkResult = await checkBookExistence(item, mockVault as any, settings);

    expect(checkResult).toBe(true);
  });
});
