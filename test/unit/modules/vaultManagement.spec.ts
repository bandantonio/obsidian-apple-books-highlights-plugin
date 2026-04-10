import { App, TFolder } from 'obsidian';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { IBookHighlightsPluginSettings } from '../../../src/types';
import { VaultManagement } from '../../../src/modules/vaultManagement';
import { defaultTemplate } from '../../../src/settings';

describe('VaultManagement', () => {
  const mockApp = {
    vault: {
      getFolderByPath: vi.fn(),
      getFileByPath: vi.fn(),
      createFolder: vi.fn(),
      create: vi.fn(),
      modify: vi.fn(),
      adapter: {
        list: vi.fn(),
        rename: vi.fn(),
      },
    },
  } as unknown as App;

  const mockSettings: IBookHighlightsPluginSettings = {
    highlightsFolder: 'ibooks-highlights',
    backup: false,
    importOnStart: false,
    highlightsSortingCriterion: 'creationDateOldToNew',
    template: defaultTemplate,
    filenameTemplate: '{{{bookTitle}}}',
    keepMeSectionOpeningDelimiter: '%% keep-me %%',
    keepMeSectionClosingDelimiter: '%% /keep-me %%',
    keepMeSectionData: {},
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getHighlightsFolder', () => {
    test('Should return correct default highlights folder name', () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      expect(vaultManagement.getHighlightsFolder()).toBe('ibooks-highlights');
    });

    test('Should return correct custom highlights folder name', () => {
      const customSettings = { ...mockSettings, highlightsFolder: '2 - Literature Notes 📝/Apple Books' };
      const vaultManagement = new VaultManagement(mockApp, customSettings);

      expect(vaultManagement.getHighlightsFolder()).toBe('2 - Literature Notes 📝/Apple Books');
    });
  });

  describe('getHighlightsFolderPath', () => {
    test('Should return correct path to default highlights folder', () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      vaultManagement.getHighlightsFolderPath();

      expect(mockApp.vault.getFolderByPath).toHaveBeenCalledWith('ibooks-highlights');
    });

    test('Should return correct path to custom highlights folder', () => {
      const customSettings = { ...mockSettings, highlightsFolder: '2 - Literature Notes 📝/Apple Books' };
      const vaultManagement = new VaultManagement(mockApp, customSettings);

      vaultManagement.getHighlightsFolderPath();

      expect(mockApp.vault.getFolderByPath).toHaveBeenCalledWith('2 - Literature Notes 📝/Apple Books');
    });

    test('Should return null if highlights folder path does not exist', () => {
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue(null);
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      const result = vaultManagement.getHighlightsFolderPath();

      expect(result).toBeNull();
    });
  });

  describe('getFilePath', () => {
    test('Should return correct file path for default filename template', () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      vaultManagement.getFilePath('Book Title');

      expect(mockApp.vault.getFileByPath).toHaveBeenCalledWith('ibooks-highlights/Book Title.md');
    });

    test('Should return correct file path for custom filename template', () => {
      const customSettings = { ...mockSettings, filenameTemplate: '{{{bookTitle}}} by {{{bookAuthor}}}' };
      const vaultManagement = new VaultManagement(mockApp, customSettings);

      vaultManagement.getFilePath('Atlas Shrugged - Ayn Rand');

      expect(mockApp.vault.getFileByPath).toHaveBeenCalledWith('ibooks-highlights/Atlas Shrugged - Ayn Rand.md');
    });
  });

  describe('createHighlightsFolder', () => {
    test('Should create highlights folder if it does not exist', async () => {
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue(null);
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      await vaultManagement.createHighlightsFolder();

      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');
    });

    test('Should create highlights folder that is nested in another folder', async () => {
      const customSettings = { ...mockSettings, highlightsFolder: '2 - Literature Notes 📝/Apple Books' };
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue(null);
      const vaultManagement = new VaultManagement(mockApp, customSettings);

      await vaultManagement.createHighlightsFolder();

      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('2 - Literature Notes 📝/Apple Books');
    });

    test('Should not create highlights folder if it already exists', async () => {
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue({ path: 'ibooks-highlights' } as TFolder);
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      await vaultManagement.createHighlightsFolder();

      expect(mockApp.vault.createFolder).not.toHaveBeenCalled();
    });
  });

  describe('createBookFile', () => {
    test('Should create book file in default highlights folder', async () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      await vaultManagement.createBookFile('Book Title', 'File content');

      expect(mockApp.vault.create).toHaveBeenCalledWith('ibooks-highlights/Book Title.md', 'File content');
    });

    test('Should create book file in custom highlights folder', async () => {
      const customSettings = { ...mockSettings, highlightsFolder: '2 - Literature Notes 📝/Apple Books' };
      const vaultManagement = new VaultManagement(mockApp, customSettings);

      await vaultManagement.createBookFile('Book Title', 'File content');

      expect(mockApp.vault.create).toHaveBeenCalledWith('2 - Literature Notes 📝/Apple Books/Book Title.md', 'File content');
    });

    test.todo('edge-case filenames (unicode, emoji)');
  });

  describe('modifyBookFile', () => {
    test('Should modify book file in default highlights folder', async () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);

      await vaultManagement.modifyBookFile({ path: 'ibooks-highlights/Book Title.md' } as any, 'New file content');

      expect(mockApp.vault.modify).toHaveBeenCalledWith({ path: 'ibooks-highlights/Book Title.md' } as any, 'New file content');
    });
  });

  describe('backupAllHighlights', () => {
    test('Should backup all highlights files in default highlights folder', async () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);
      vi.spyOn(Date, 'now').mockReturnValue(1704060001); // January 1, 2024, 12:00:01 AM
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue({ path: 'ibooks-highlights' } as TFolder);
      vi.mocked(mockApp.vault.adapter.list).mockImplementation(async (folder) => {
        if (folder === 'ibooks-highlights') {
          return {
            files: [
              'ibooks-highlights/Book Title.md',
              'ibooks-highlights/Another Book.md',
            ],
            folders: [],
          }; // oxfmt-ignore
        }
        if (folder === 'ibooks-highlights-bk-1704060001') {
          return {
            files: [
              'ibooks-highlights-bk-1704060001/Book Title.md',
              'ibooks-highlights-bk-1704060001/Another Book.md',
            ], // oxfmt-ignore
            folders: [],
          };
        }
        return { files: [], folders: [] };
      });

      await vaultManagement.backupAllHighlights();
      expect(mockApp.vault.adapter.rename).toHaveBeenCalledWith('ibooks-highlights', 'ibooks-highlights-bk-1704060001');
      expect((await mockApp.vault.adapter.list('ibooks-highlights-bk-1704060001')).files).toHaveLength(2);
      expect((await mockApp.vault.adapter.list('ibooks-highlights-bk-1704060001')).files).toEqual([
        'ibooks-highlights-bk-1704060001/Book Title.md',
        'ibooks-highlights-bk-1704060001/Another Book.md',
      ]);
    });

    test('Should backup all highlights files in custom highlights folder with nested files', async () => {
      const customSettings = { ...mockSettings, highlightsFolder: '2 - Literature Notes 📝/Apple Books' };
      const vaultManagement = new VaultManagement(mockApp, customSettings);
      vi.spyOn(Date, 'now').mockReturnValue(1704060001);
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue({ path: '2 - Literature Notes 📝/Apple Books' } as TFolder);
      vi.mocked(mockApp.vault.adapter.list).mockImplementation(async (folder) => {
        if (folder === '2 - Literature Notes 📝/Apple Books') {
          return {
            files: [
              '2 - Literature Notes 📝/Apple Books/Book Title.md',
              '2 - Literature Notes 📝/Apple Books/Another Book.md',
              '2 - Literature Notes 📝/Apple Books/Nested Folder/Book in Nested Folder.md',
            ],
            folders: ['2 - Literature Notes 📝/Apple Books/Nested Folder'],
          };
        }
        if (folder === '2 - Literature Notes 📝/Apple Books-bk-1704060001') {
          return {
            files: [
              '2 - Literature Notes 📝/Apple Books-bk-1704060001/Book Title.md',
              '2 - Literature Notes 📝/Apple Books-bk-1704060001/Another Book.md',
              '2 - Literature Notes 📝/Apple Books-bk-1704060001/Nested Folder/Book in Nested Folder.md',
            ],
            folders: ['2 - Literature Notes 📝/Apple Books-bk-1704060001/Nested Folder'],
          };
        }
        return { files: [], folders: [] };
      });

      await vaultManagement.backupAllHighlights();

      expect(mockApp.vault.adapter.rename).toHaveBeenCalledWith(
        '2 - Literature Notes 📝/Apple Books',
        '2 - Literature Notes 📝/Apple Books-bk-1704060001',
      );

      expect((await mockApp.vault.adapter.list('2 - Literature Notes 📝/Apple Books-bk-1704060001')).files).toHaveLength(3);
      expect((await mockApp.vault.adapter.list('2 - Literature Notes 📝/Apple Books-bk-1704060001')).files).toEqual([
        '2 - Literature Notes 📝/Apple Books-bk-1704060001/Book Title.md',
        '2 - Literature Notes 📝/Apple Books-bk-1704060001/Another Book.md',
        '2 - Literature Notes 📝/Apple Books-bk-1704060001/Nested Folder/Book in Nested Folder.md',
      ]);
    });

    test('Should not backup highlights if highlights folder does not exist', async () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue(null);

      await vaultManagement.backupAllHighlights();

      expect(mockApp.vault.adapter.rename).not.toHaveBeenCalled();
    });

    test('Should not backup highlights if highlights folder is empty', async () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);
      vi.mocked(mockApp.vault.getFolderByPath).mockReturnValue({ path: 'ibooks-highlights' } as TFolder);
      vi.mocked(mockApp.vault.adapter.list).mockResolvedValue({
        files: [],
      } as any);

      await vaultManagement.backupAllHighlights();

      expect(mockApp.vault.adapter.rename).not.toHaveBeenCalled();
    });
  });

  describe('backupBookFile', () => {
    test('Should backup book file in default highlights folder', async () => {
      const vaultManagement = new VaultManagement(mockApp, mockSettings);
      vi.spyOn(Date, 'now').mockReturnValue(1704060001);

      await vaultManagement.backupBookFile({ path: 'ibooks-highlights/Book Title.md', basename: 'Book Title' } as any);

      expect(mockApp.vault.adapter.rename).toHaveBeenCalledWith(
        'ibooks-highlights/Book Title.md',
        'ibooks-highlights/Book Title-bk-1704060001.md',
      );
    });

    test('Should backup book file in custom highlights folder', async () => {
      const customSettings = { ...mockSettings, highlightsFolder: '2 - Literature Notes 📝/Apple Books' };
      const vaultManagement = new VaultManagement(mockApp, customSettings);
      vi.spyOn(Date, 'now').mockReturnValue(1704060001);

      await vaultManagement.backupBookFile({ path: '2 - Literature Notes 📝/Apple Books/Book Title.md', basename: 'Book Title' } as any);

      expect(mockApp.vault.adapter.rename).toHaveBeenCalledWith(
        '2 - Literature Notes 📝/Apple Books/Book Title.md',
        '2 - Literature Notes 📝/Apple Books/Book Title-bk-1704060001.md',
      );
    });
  });
});
