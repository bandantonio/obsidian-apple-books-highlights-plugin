import path from 'path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RenderService } from '../../src/services/renderService';
import { VaultService } from '../../src/services/vaultService';
import { AppleBooksHighlightsImportPluginSettings } from '../../src/settings';
import type { ICombinedBooksAndHighlights } from '../../src/types';
import { aggregatedUnsortedHighlights } from '../mocks/aggregatedDetailsData';
import { defaultTemplateMockWithAnnotationsSortedByDefault } from '../mocks/renderedTemplate';

const mockApp: any = {
  vault: {
    getFileByPath: vi.fn(),
    getFolderByPath: vi.fn(),
    create: vi.fn(),
    createFolder: vi.fn(),
    modify: vi.fn(),
    delete: vi.fn(),
    adapter: {
      list: vi.fn(),
      copy: vi.fn(),
    },
  },
};

describe('VaultService', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getHighlightsFolder', () => {
    test('Should return the highlights folder if it exists', () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      mockApp.vault.getFolderByPath.mockReturnValue({ path: settings.highlightsFolder });
      const vaultService = new VaultService(mockApp, settings);

      const result = vaultService.getHighlightsFolder();

      expect(result).toEqual({ path: settings.highlightsFolder });
      expect(mockApp.vault.getFolderByPath).toHaveBeenCalledWith(settings.highlightsFolder);
    });

    test('Should return null if the highlights folder does not exist', () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      mockApp.vault.getFolderByPath.mockReturnValue(null);
      const vaultService = new VaultService(mockApp, settings);

      const result = vaultService.getHighlightsFolder();

      expect(result).toBeNull();
      expect(mockApp.vault.getFolderByPath).toHaveBeenCalledWith(settings.highlightsFolder);
    });
  });

  describe('checkFileExistence', () => {
    test('Should return the file if it exists', () => {
      const filePath = 'ibooks-highlights/Some-book.md';
      const settings = new AppleBooksHighlightsImportPluginSettings();
      mockApp.vault.getFileByPath.mockReturnValue({ path: filePath });
      const vaultService = new VaultService(mockApp, settings);

      const result = vaultService.checkFileExistence(filePath);

      expect(result).toEqual({ path: filePath });
      expect(mockApp.vault.getFileByPath).toHaveBeenCalledWith(filePath);
    });

    test('Should return null if the file does not exist', () => {
      const filePath = 'ibooks-highlights/Non-existent-book.md';
      const settings = new AppleBooksHighlightsImportPluginSettings();
      mockApp.vault.getFileByPath.mockReturnValue(null);
      const vaultService = new VaultService(mockApp, settings);

      const result = vaultService.checkFileExistence(filePath);

      expect(result).toBeNull();
      expect(mockApp.vault.getFileByPath).toHaveBeenCalledWith(filePath);
    });
  });

  describe('checkBookExistence', () => {
    test('Should return false if the book file does not exist', () => {
      const mockedHighlights = aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights;
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      mockApp.vault.getFileByPath.mockReturnValue(null);

      const result = vaultService.checkBookExistence(mockedHighlights);

      expect(result).toBe(false);
    });

    test('Should return true if the book file exists', () => {
      const mockedHighlights = aggregatedUnsortedHighlights[0] as ICombinedBooksAndHighlights;
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);
      const renderService = new RenderService();
      const renderedFilename = renderService.renderTemplate(mockedHighlights, settings.filenameTemplate);

      const pathToFile = path.join(settings.highlightsFolder, `${renderedFilename}.md`);
      mockApp.vault.getFileByPath.mockReturnValue({ path: pathToFile });

      const result = vaultService.checkBookExistence(mockedHighlights);

      expect(result).toBe(true);
      expect(mockApp.vault.getFileByPath).toHaveBeenCalledWith(pathToFile);
    });
  });

  describe('createNewBookFile', () => {
    test('Should create a new book file in the vault', async () => {
      const mockedHighlights = defaultTemplateMockWithAnnotationsSortedByDefault;
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      const filePath =
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc..md';
      mockApp.vault.create.mockResolvedValue({ path: filePath });
      await vaultService.createNewBookFile(filePath, mockedHighlights);

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(filePath, mockedHighlights);
      expect(mockApp.vault.create).toHaveResolvedWith({ path: filePath });
    });
  });

  describe('modifyExistingBookFile', () => {
    test('Should modify an existing book file in the vault', async () => {
      const mockedHighlights = defaultTemplateMockWithAnnotationsSortedByDefault;
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      const filePath = {
        path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc..md',
      } as any;
      await vaultService.modifyExistingBookFile(filePath, mockedHighlights);

      expect(mockApp.vault.modify).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.modify).toHaveBeenCalledWith(filePath, mockedHighlights);
    });
  });

  describe('createHighlightsFolder', () => {
    test('Should create highlights folder in the vault', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      mockApp.vault.createFolder.mockResolvedValue({ path: settings.highlightsFolder });
      await vaultService.createHighlightsFolder();

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith(settings.highlightsFolder);
      expect(mockApp.vault.createFolder).toHaveResolvedWith({ path: settings.highlightsFolder });
    });
  });

  describe('recreateHighlightsFolder', () => {
    test('Should delete and recreate highlights folder in the vault', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      const folderPath = { path: settings.highlightsFolder } as any;
      mockApp.vault.getFolderByPath.mockReturnValue(folderPath);
      await vaultService.recreateHighlightsFolder();

      expect(mockApp.vault.delete).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.delete).toHaveBeenCalledWith(folderPath, true);
      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith(settings.highlightsFolder);
    });
  });

  describe('backupAllHighlights', () => {
    beforeEach(() => {
      const mockedTimestamp = 1704060001; // January 1, 2024, 12:00:01 AM
      Date.now = vi.fn().mockImplementation(() => mockedTimestamp);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    test('Should skip backup if the highlights folder does not exist', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      mockApp.vault.getFolderByPath.mockReturnValue(null);

      await vaultService.backupAllHighlights();

      expect(mockApp.vault.getFolderByPath).toHaveBeenCalledWith(settings.highlightsFolder);
      expect(mockApp.vault.createFolder).not.toHaveBeenCalled();
    });

    test('Should skip backup if the highlights folder is empty', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      mockApp.vault.getFolderByPath.mockReturnValue({ path: settings.highlightsFolder });
      mockApp.vault.adapter.list.mockResolvedValue({ files: [] });

      await vaultService.backupAllHighlights();

      expect(mockApp.vault.adapter.list).toHaveBeenCalledWith(settings.highlightsFolder);
      expect(mockApp.vault.createFolder).not.toHaveBeenCalled();
      expect(mockApp.vault.delete).not.toHaveBeenCalled();
    });

    test('Should backup all the content of the highlights folder', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      const highlightsFolderPath = { path: settings.highlightsFolder };
      mockApp.vault.getFolderByPath.mockReturnValue(highlightsFolderPath);

      const highlightsFiles = [`${settings.highlightsFolder}/file1.md`, `${settings.highlightsFolder}/file2.md`];

      mockApp.vault.adapter.list.mockResolvedValue({ files: highlightsFiles });

      await vaultService.backupAllHighlights();

      expect(mockApp.vault.createFolder).toHaveBeenCalledWith(`${settings.highlightsFolder}-bk-1704060001`);
      expect(mockApp.vault.adapter.copy).toHaveBeenCalledTimes(2); // highlightsFiles.length

      expect(mockApp.vault.delete).toHaveBeenCalledWith(highlightsFolderPath, true);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith(settings.highlightsFolder);
    });
  });

  describe('backupSingleBookHighlights', () => {
    beforeEach(() => {
      const mockedTimestamp = 1704060001; // January 1, 2024, 12:00:01 AM
      Date.now = vi.fn().mockImplementation(() => mockedTimestamp);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    test('Should backup a single book highlights', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      const filename = 'Hello-world';
      const vaultFile = { path: `${settings.highlightsFolder}/${filename}.md` };
      mockApp.vault.getFileByPath.mockReturnValue(vaultFile);

      const backupBookTitle = `${filename}-bk-1704060001.md`;

      await vaultService.backupSingleBookHighlights(filename);

      expect(mockApp.vault.adapter.copy).toHaveBeenCalledWith(vaultFile.path, `${settings.highlightsFolder}/${backupBookTitle}`);
    });

    test('Should skip backup if the book file does not exist (when file template was changed between imports of the same book)', async () => {
      const settings = new AppleBooksHighlightsImportPluginSettings();
      const vaultService = new VaultService(mockApp, settings);

      const filename = 'Hello-world';
      mockApp.vault.getFileByPath.mockReturnValue(null);

      await vaultService.backupSingleBookHighlights(filename);

      expect(mockApp.vault.adapter.copy).not.toHaveBeenCalled();
    });
  });
});
