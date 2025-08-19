import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SaveHighlights from '../src/methods/saveHighlightsToVault';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import defaultTemplate from '../src/template';
import type { ICombinedBooksAndHighlights } from '../src/types';
import { aggregatedUnsortedHighlights } from './mocks/aggregatedDetailsData';
import { rawCustomTemplateMock, rawCustomTemplateMockWithWrappedTextBlockContainingNewlines } from './mocks/rawTemplates';
import {
  defaultTemplateMockWithAnnotationsSortedByDefault,
  renderedCustomTemplateMockWithDefaultSorting,
  renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines,
} from './mocks/renderedTemplate';

const mockVault = {
  getFileByPath: vi.fn(),
  getFolderByPath: vi.fn(),
  // biome-ignore lint/suspicious/useAwait: Imitation of file async operations
  createFolder: vi.fn().mockImplementation(async (_folderName: string) => {
    return;
  }),
  // biome-ignore lint/suspicious/useAwait: Imitation of file async operations
  create: vi.fn().mockImplementation(async (_filePath: string, _data: string) => {
    return;
  }),
  // biome-ignore lint/suspicious/useAwait: Imitation of file async operations
  modify: vi.fn().mockImplementation(async (_file: any, _data: string) => {
    return;
  }),
  // biome-ignore lint/suspicious/useAwait: Imitation of file async operations
  delete: vi.fn().mockImplementation(async (_folderPath: string, _force: boolean) => {
    return;
  }),
  adapter: {
    list: vi.fn(),
    // biome-ignore lint/suspicious/useAwait: Imitation of file async operations
    copy: vi.fn().mockImplementation(async (_source: string, _destination: string) => {
      return;
    }),
  },
};

beforeEach(() => {
  const mockedTimestamp = 1704060001; // January 1, 2024, 12:00:01 AM
  Date.now = vi.fn().mockImplementation(() => mockedTimestamp);
  settings.template = defaultTemplate;
  settings.filenameTemplate = '{{{bookTitle}}}';
});

afterEach(() => {
  vi.resetAllMocks();
});

const settings = new AppleBooksHighlightsImportPluginSettings();

describe('Save all highlights to vault', () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const tzSpy = vi.spyOn(dayjs.tz, 'guess');

  test('Should save highlights to vault using the default template', async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
    const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
    expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.delete).toHaveBeenCalledTimes(1);
    expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      defaultTemplateMockWithAnnotationsSortedByDefault,
    );
  });

  test('Should save highlights to vault using the default template and custom file name', async () => {
    settings.filenameTemplate = '{{{bookTitle}}} by {{{bookAuthor}}}';

    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
    const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
    expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.delete).toHaveBeenCalledTimes(1);
    expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc..md',
      defaultTemplateMockWithAnnotationsSortedByDefault,
    );
  });

  test('Should save highlights to vault using the custom colored template', async () => {
    tzSpy.mockImplementation(() => 'America/New_York');

    settings.template = rawCustomTemplateMock;

    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
    const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
    expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.delete).toHaveBeenCalledTimes(1);
    expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      renderedCustomTemplateMockWithDefaultSorting,
    );
  });

  test('Should save highlights to vault using the custom colored template and file name', async () => {
    tzSpy.mockImplementation(() => 'America/New_York');

    settings.template = rawCustomTemplateMock;
    settings.filenameTemplate = '{{{bookTitle}}} by {{{bookAuthor}}}';

    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title by Apple Inc..md',
      renderedCustomTemplateMockWithDefaultSorting,
    );
  });

  test('Should save highlights to vault using the custom template with wrapped text block', async () => {
    settings.template = rawCustomTemplateMockWithWrappedTextBlockContainingNewlines;
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
    const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
    expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.delete).toHaveBeenCalledTimes(1);
    expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines,
    );
  });

  test('Should skip saving highlights to vault if highlights are not found', async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, highlightsFolder: '' });
    const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('');

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
    expect(spyGetFolderByPath).toHaveBeenCalledWith('');

    expect(mockVault.delete).toHaveBeenCalledTimes(0);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('');
  });

  test('Should backup highlights if backup option is enabled', async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });

    vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
    const spyList = vi.spyOn(mockVault.adapter, 'list').mockImplementation((_folderPath: string) => {
      return {
        files: ['ibooks-highlights/Hello-world.md', 'ibooks-highlights/Goodbye-world.md'],
      };
    });

    await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

    expect(spyList).toHaveBeenCalledTimes(1);
    expect(spyList).toReturnWith({
      files: ['ibooks-highlights/Hello-world.md', 'ibooks-highlights/Goodbye-world.md'],
    });

    expect(mockVault.createFolder).toHaveBeenCalledTimes(2);
    expect(mockVault.createFolder).toHaveBeenNthCalledWith(1, 'ibooks-highlights-bk-1704060001');
    expect(mockVault.createFolder).toHaveBeenNthCalledWith(2, 'ibooks-highlights');

    expect(mockVault.adapter.copy).toHaveBeenNthCalledWith(
      1,
      'ibooks-highlights/Hello-world.md',
      'ibooks-highlights-bk-1704060001/Hello-world.md',
    );
    expect(mockVault.adapter.copy).toHaveBeenNthCalledWith(
      2,
      'ibooks-highlights/Goodbye-world.md',
      'ibooks-highlights-bk-1704060001/Goodbye-world.md',
    );
  });
});

describe('Save single book highlights to vault', () => {
  test("Should save a single book when the book doesn't exist and backups are turned off", async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);

    await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], true);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      defaultTemplateMockWithAnnotationsSortedByDefault,
    );
  });

  test("Should save a single book when the book doesn't exist and backups are turned on", async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });

    await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], true);

    expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
    expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

    expect(mockVault.create).toHaveBeenCalledTimes(1);
    expect(mockVault.create).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      defaultTemplateMockWithAnnotationsSortedByDefault,
    );

    expect(mockVault.adapter.copy).toHaveBeenCalledTimes(0);
    expect(mockVault.delete).toHaveBeenCalledTimes(0);
  });

  test('Should modify a single book when it already exists in vault and backups are turned off', async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
    vi.spyOn(mockVault, 'getFileByPath').mockReturnValue({
      path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
    });

    vi.spyOn(saveHighlights, 'modifyExistingBookFile');

    await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], false);

    expect(saveHighlights.modifyExistingBookFile).toHaveBeenCalledTimes(1);
    expect(saveHighlights.modifyExistingBookFile).toHaveBeenCalledWith(
      {
        path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      },
      defaultTemplateMockWithAnnotationsSortedByDefault,
    );
  });

  test('Should modify a single book when it already exists in vault and backups are turned on', async () => {
    const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });
    vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
    vi.spyOn(mockVault, 'getFileByPath').mockReturnValue({
      path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
    });

    await saveHighlights.saveSingleBookHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[], false);

    expect(mockVault.getFileByPath).toHaveBeenCalledTimes(2);
    expect(mockVault.getFileByPath).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
    );

    expect(mockVault.adapter.copy).toHaveBeenCalledTimes(1);
    expect(mockVault.adapter.copy).toHaveBeenCalledWith(
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
      'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title-bk-1704060001.md',
    );
  });
});
