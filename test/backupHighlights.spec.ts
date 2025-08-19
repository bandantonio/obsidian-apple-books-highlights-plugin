import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import BackupHighlights from '../src/utils/backupHighlights';

const mockVault = {
  getFolderByPath: vi.fn(),
  getFileByPath: vi.fn(),
  // biome-ignore lint/suspicious/useAwait: imitation of async copy
  createFolder: vi.fn().mockImplementation(async (_folderName: string) => {
    return;
  }),
  adapter: {
    list: vi.fn(),
    // biome-ignore lint/suspicious/useAwait: imitation of async copy
    copy: vi.fn().mockImplementation(async (_source: string, _destination: string) => {
      return;
    }),
  },
  // biome-ignore lint/suspicious/useAwait: imitation of async copy
  delete: vi.fn().mockImplementation(async (_folderPath: string, _force: boolean) => {
    return;
  }),
};

const settings = new AppleBooksHighlightsImportPluginSettings();

beforeEach(() => {
  const mockedTimestamp = 1704060001; // January 1, 2024, 12:00:01 AM
  Date.now = vi.fn().mockImplementation(() => mockedTimestamp);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Backup all highlights', () => {
  test('Should skip backup if the highlights folder does not exist', async () => {
    mockVault.getFolderByPath.mockReturnValue(null);

    const backupHighlights = new BackupHighlights(mockVault as any, settings);
    await backupHighlights.backupAllHighlights();

    expect(mockVault.getFolderByPath).toHaveBeenCalledWith(settings.highlightsFolder);
    expect(mockVault.createFolder).not.toHaveBeenCalled();
  });

  test('Should skip backup if the highlights folder is empty', async () => {
    mockVault.getFolderByPath.mockReturnValue({ path: settings.highlightsFolder });
    mockVault.adapter.list.mockResolvedValue({ files: [] });

    const backupHighlights = new BackupHighlights(mockVault as any, settings);
    await backupHighlights.backupAllHighlights();

    expect(mockVault.adapter.list).toHaveBeenCalledWith(settings.highlightsFolder);
    expect(mockVault.createFolder).not.toHaveBeenCalled();
    expect(mockVault.delete).not.toHaveBeenCalled();
  });

  test('Should backup all the content of the highlights folder', async () => {
    const highlightsFolderPath = { path: settings.highlightsFolder };
    mockVault.getFolderByPath.mockReturnValue(highlightsFolderPath);

    const highlightsFiles = [`${settings.highlightsFolder}/file1.md`, `${settings.highlightsFolder}/file2.md`];
    mockVault.adapter.list.mockResolvedValue({ files: highlightsFiles });

    const backupHighlights = new BackupHighlights(mockVault as any, settings);
    await backupHighlights.backupAllHighlights();

    expect(mockVault.createFolder).toHaveBeenCalledWith(`${settings.highlightsFolder}-bk-1704060001`);
    expect(mockVault.adapter.copy).toHaveBeenCalledTimes(2); // highlightsFiles.length

    expect(mockVault.delete).toHaveBeenCalledWith(highlightsFolderPath, true);
    expect(mockVault.createFolder).toHaveBeenCalledWith(settings.highlightsFolder);
  });
});

describe('Backup single book highlights', () => {
  test('Should backup a single book highlights', async () => {
    const bookTitle = 'Hello-world';
    const vaultFile = { path: `${settings.highlightsFolder}/${bookTitle}.md` };
    mockVault.getFileByPath = vi.fn().mockReturnValue(vaultFile);

    const backupBookTitle = `${bookTitle}-bk-1704060001.md`;

    const backupHighlights = new BackupHighlights(mockVault as any, settings);
    await backupHighlights.backupSingleBookHighlights(bookTitle);

    expect(mockVault.adapter.copy).toHaveBeenCalledWith(vaultFile.path, `${settings.highlightsFolder}/${backupBookTitle}`);
  });
});
