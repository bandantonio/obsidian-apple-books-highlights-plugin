import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SaveHighlights from '../src/saveHighlightsToVault';
import { VaultService } from '../src/services/vaultService';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import type { ICombinedBooksAndHighlights } from '../src/types';
import { aggregatedUnsortedHighlights } from './mocks/aggregatedDetailsData';
import { rawCustomTemplateMock, rawCustomTemplateMockWithWrappedTextBlockContainingNewlines } from './mocks/rawTemplates';
import {
  defaultTemplateMockWithAnnotationsSortedByDefault,
  renderedCustomTemplateMockWithDefaultSorting,
  renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines,
} from './mocks/renderedTemplate';

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

describe('saveHighlightsToVault', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Default template', () => {
    const settings = new AppleBooksHighlightsImportPluginSettings();

    test('Should save highlights to vault using the default template', async () => {
      const saveHighlights = new SaveHighlights(mockApp, settings);

      const spyGetFolderByPath = vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
      expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.delete).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        defaultTemplateMockWithAnnotationsSortedByDefault,
      );
    });

    test('Should save highlights to vault using the default template and custom file name', async () => {
      const saveHighlights = new SaveHighlights(mockApp, { ...settings, filenameTemplate: '{{{bookTitle}}} by {{{bookAuthor}}}' });

      const spyGetFolderByPath = vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
      expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.delete).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc..md',
        defaultTemplateMockWithAnnotationsSortedByDefault,
      );
    });
  });

  describe('Custom template', () => {
    beforeEach(() => {
      const mockedTimestamp = 1704060001; // January 1, 2024, 12:00:01 AM
      Date.now = vi.fn().mockImplementation(() => mockedTimestamp);
      dayjs.extend(utc);
      dayjs.extend(timezone);
    });

    const settings = new AppleBooksHighlightsImportPluginSettings();

    test('Should save highlights to vault using the custom colored template', async () => {
      const tzSpy = vi.spyOn(dayjs.tz, 'guess');
      tzSpy.mockImplementation(() => 'America/New_York');

      const saveHighlights = new SaveHighlights(mockApp, { ...settings, template: rawCustomTemplateMock });
      const spyGetFolderByPath = vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
      expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.delete).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        renderedCustomTemplateMockWithDefaultSorting,
      );
    });

    test('Should save highlights to vault using the custom colored template and file name', async () => {
      const tzSpy = vi.spyOn(dayjs.tz, 'guess');
      tzSpy.mockImplementation(() => 'America/New_York');

      const saveHighlights = new SaveHighlights(mockApp, {
        ...settings,
        template: rawCustomTemplateMock,
        filenameTemplate: '{{{bookTitle}}} by {{{bookAuthor}}}',
      });

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc..md',
        renderedCustomTemplateMockWithDefaultSorting,
      );
    });

    test('Should save highlights to vault using the custom template with wrapped text block', async () => {
      const saveHighlights = new SaveHighlights(mockApp, {
        ...settings,
        template: rawCustomTemplateMockWithWrappedTextBlockContainingNewlines,
      });
      const spyGetFolderByPath = vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
      expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.delete).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines,
      );
    });

    test('Should skip saving highlights to vault if highlights are not found', async () => {
      const saveHighlights = new SaveHighlights(mockApp, { ...settings, highlightsFolder: '' });
      const spyGetFolderByPath = vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('');

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
      expect(spyGetFolderByPath).toHaveBeenCalledWith('');

      expect(mockApp.vault.delete).toHaveBeenCalledTimes(0);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('');
    });

    test('Should backup highlights if backup option is enabled', async () => {
      const saveHighlights = new SaveHighlights(mockApp, { ...settings, backup: true });

      vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
      const spyList = vi.spyOn(mockApp.vault.adapter, 'list').mockImplementation((_folderPath: string) => {
        return {
          files: ['ibooks-highlights/Hello-world.md', 'ibooks-highlights/Goodbye-world.md'],
        };
      });

      await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

      expect(spyList).toHaveBeenCalledTimes(1);
      expect(spyList).toReturnWith({
        files: ['ibooks-highlights/Hello-world.md', 'ibooks-highlights/Goodbye-world.md'],
      });

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(2);
      expect(mockApp.vault.createFolder).toHaveBeenNthCalledWith(1, 'ibooks-highlights-bk-1704060001');
      expect(mockApp.vault.createFolder).toHaveBeenNthCalledWith(2, 'ibooks-highlights');

      expect(mockApp.vault.adapter.copy).toHaveBeenNthCalledWith(
        1,
        'ibooks-highlights/Hello-world.md',
        'ibooks-highlights-bk-1704060001/Hello-world.md',
      );
      expect(mockApp.vault.adapter.copy).toHaveBeenNthCalledWith(
        2,
        'ibooks-highlights/Goodbye-world.md',
        'ibooks-highlights-bk-1704060001/Goodbye-world.md',
      );
    });
  });

  describe('saveSingleBookHighlightsToVault', () => {
    beforeEach(() => {
      const mockedTimestamp = 1704060001; // January 1, 2024, 12:00:01 AM
      Date.now = vi.fn().mockImplementation(() => mockedTimestamp);
    });

    const settings = new AppleBooksHighlightsImportPluginSettings();

    test("Should save a single book when the book doesn't exist and backups are turned off", async () => {
      const saveHighlights = new SaveHighlights(mockApp, settings);

      await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], true);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        defaultTemplateMockWithAnnotationsSortedByDefault,
      );
    });

    test("Should save a single book when the book doesn't exist and backups are turned on", async () => {
      const saveHighlights = new SaveHighlights(mockApp, { ...settings, backup: true });

      await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], true);

      expect(mockApp.vault.createFolder).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

      expect(mockApp.vault.create).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.create).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        defaultTemplateMockWithAnnotationsSortedByDefault,
      );

      expect(mockApp.vault.adapter.copy).toHaveBeenCalledTimes(0);
      expect(mockApp.vault.delete).toHaveBeenCalledTimes(0);
    });

    test('Should modify a single book when it already exists in vault and backups are turned off', async () => {
      const saveHighlights = new SaveHighlights(mockApp, settings);

      vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
      vi.spyOn(mockApp.vault, 'getFileByPath').mockReturnValue({
        path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      });

      const spyModifyExistingBookFile = vi.spyOn(VaultService.prototype, 'modifyExistingBookFile');

      await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], false);

      expect(spyModifyExistingBookFile).toHaveBeenCalledTimes(1);
      expect(spyModifyExistingBookFile).toHaveBeenCalledWith(
        {
          path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        },
        defaultTemplateMockWithAnnotationsSortedByDefault,
      );
    });

    test('Should modify a single book when it already exists in vault and backups are turned on', async () => {
      const saveHighlights = new SaveHighlights(mockApp, { ...settings, backup: true });
      vi.spyOn(mockApp.vault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
      vi.spyOn(mockApp.vault, 'getFileByPath').mockReturnValue({
        path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      });

      await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], false);

      expect(mockApp.vault.getFileByPath).toHaveBeenCalledTimes(2);
      expect(mockApp.vault.getFileByPath).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      );

      expect(mockApp.vault.adapter.copy).toHaveBeenCalledTimes(1);
      expect(mockApp.vault.adapter.copy).toHaveBeenCalledWith(
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
        'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title-bk-1704060001.md',
      );
    });
  });
});
