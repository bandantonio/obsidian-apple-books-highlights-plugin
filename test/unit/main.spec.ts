import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as aggregatedBooksAndAnnotations from '../fixtures/annotationProcessing/aggregatedBooksAndAnnotations.json';
import { NoticeMock } from '../mocks/obsidian';

vi.mock('obsidian', async () => {
  return await import('../mocks/obsidian');
});

import IBookHighlightsPlugin from '../../main';

vi.mock('../../src/modules/annotationsProcessing', () => ({
  aggregateBooksWithAnnotations: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../src/modules/templateProcessing', () => ({
  compileTemplate: vi.fn().mockReturnValue(() => ''),
}));
const backupAllHighlightsMock = vi.fn();
vi.mock('../../src/modules/vaultManagement', () => ({
  VaultManagement: vi.fn().mockImplementation(() => ({
    backupAllHighlights: backupAllHighlightsMock,
  })),
}));
const importHighlightsMock = vi.fn();
vi.mock('../../src/importHighlights', () => ({
  importHighlights: (...args: any[]) => importHighlightsMock(...args),
}));

const mockAddRibbonIcon = vi.fn();
const mockAddCommand = vi.fn();

const mockLoadData = vi.fn();
const mockSaveData = vi.fn();

describe('IBookHighlightsPlugin', () => {
  let plugin: IBookHighlightsPlugin;

  beforeEach(() => {
    vi.clearAllMocks();
    plugin = new IBookHighlightsPlugin({} as any, {} as any);
    plugin.addRibbonIcon = mockAddRibbonIcon;
    plugin.addCommand = mockAddCommand;
    plugin.loadData = mockLoadData;
    plugin.saveData = mockSaveData;
    plugin.manifest = { name: 'Apple Books Test Mock' } as any;
    plugin.app = {
      vault: {
        getFolderByPath: vi.fn().mockReturnValue({}),
        getFileByPath: vi.fn(),
        createFolder: vi.fn(),
        create: vi.fn(),
      },
      workspace: {
        // Fix: support async callbacks in onLayoutReady
        onLayoutReady: vi.fn().mockImplementation(async (cb: () => Promise<void> | void) => await cb()),
        on: vi.fn(),
      },
    } as any;
  });

  test('Should load settings on onload', async () => {
    mockLoadData.mockResolvedValueOnce({ some: 'settings' });
    await plugin.onload();
    expect(mockLoadData).toHaveBeenCalled();
    expect(plugin.settings).toBeDefined();
  });

  test('Should call onunload', () => {
    expect(() => plugin.onunload()).not.toThrow();
  });

  test('Should register ribbon icon and commands', async () => {
    mockLoadData.mockResolvedValueOnce({});
    await plugin.onload();
    expect(mockAddRibbonIcon).toHaveBeenCalled();
    expect(mockAddCommand).toHaveBeenCalled();
  });

  test('Should save settings', async () => {
    const validSettings = {
      highlightsFolder: 'folder',
      backup: true,
      importOnStart: false,
      highlightsSortingCriterion: 'creationDateOldToNew' as const,
      template: 'template',
      filenameTemplate: 'filename',
      keepMeSectionOpeningDelimiter: '%% keep-me %%',
      keepMeSectionClosingDelimiter: '%% /keep-me %%',
      keepMeSectionData: {},
    };
    plugin.settings = validSettings;
    await plugin.saveSettings();
    expect(mockSaveData).toHaveBeenCalledWith(validSettings);
  });

  describe('Import on start', () => {
    test('Should import all highlights on start and ensure that backup is created when backup is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ importOnStart: true, backup: true } as any);
      importHighlightsMock.mockResolvedValueOnce(aggregatedBooksAndAnnotations);

      const onLayoutReadyPromise = new Promise<void>((resolve) => {
        (plugin.app.workspace.onLayoutReady as any).mockImplementationOnce(async (cb: () => Promise<void> | void) => {
          await cb();
          resolve();
        });
      });

      await plugin.onload();
      await onLayoutReadyPromise;

      expect(backupAllHighlightsMock).toHaveBeenCalled();
      expect(importHighlightsMock).toHaveBeenCalledWith(plugin.vault, expect.anything(), 'modify');
      expect(NoticeMock).toHaveBeenCalledWith('Apple Books highlights imported successfully');
    });

    test('Should show OverwriteBookModal on start without creating a backup when backup is disabled', async () => {
      mockLoadData.mockResolvedValueOnce({ importOnStart: true, backup: false } as any);

      const openMock = vi.fn();
      const { OverwriteBookModal } = await import('../../src/modals/overwriteConsent');
      vi.spyOn(OverwriteBookModal.prototype, 'open').mockImplementation(openMock);

      const onLayoutReadyPromise = new Promise<void>((resolve) => {
        (plugin.app.workspace.onLayoutReady as any).mockImplementationOnce(async (cb: () => Promise<void> | void) => {
          await cb();
          resolve();
        });
      });

      await plugin.onload();
      await onLayoutReadyPromise;

      expect(backupAllHighlightsMock).not.toHaveBeenCalled();
      expect(importHighlightsMock).not.toHaveBeenCalled();
      expect(openMock).toHaveBeenCalled();
    });

    test('Should show success notice if import on start succeeds and backup is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ importOnStart: true, backup: true } as any);
      importHighlightsMock.mockResolvedValueOnce(aggregatedBooksAndAnnotations);

      const onLayoutReadyPromise = new Promise<void>((resolve) => {
        (plugin.app.workspace.onLayoutReady as any).mockImplementationOnce(async (cb: () => Promise<void> | void) => {
          await cb();
          resolve();
        });
      });

      await plugin.onload();
      await onLayoutReadyPromise;

      expect(NoticeMock).toHaveBeenCalledWith('Apple Books highlights imported successfully');
    });

    test('Should show error notice if import fails on start and backup is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ importOnStart: true, backup: true } as any);
      importHighlightsMock.mockRejectedValueOnce(new Error('Import failed'));

      const onLayoutReadyPromise = new Promise<void>((resolve) => {
        (plugin.app.workspace.onLayoutReady as any).mockImplementationOnce(async (cb: () => Promise<void> | void) => {
          await cb();
          resolve();
        });
      });

      await plugin.onload();
      await onLayoutReadyPromise;

      expect(backupAllHighlightsMock).toHaveBeenCalled();
      expect(importHighlightsMock).toHaveBeenCalledWith(plugin.vault, expect.anything(), 'modify');
      expect(NoticeMock).toHaveBeenCalledWith('[Apple Books Test Mock]:\nError importing highlights. Check console for details (⌥ ⌘ I)', 0);
    });
  });
  describe('Ribbon action import', () => {
    test('Should backup and import all highlights on ribbon icon click if backup setting is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ backup: true } as any);
      importHighlightsMock.mockResolvedValueOnce(aggregatedBooksAndAnnotations);
      await plugin.onload();
      const callback = mockAddRibbonIcon.mock.calls[0][2];
      await callback({} as any);
      expect(backupAllHighlightsMock).toHaveBeenCalled();
      expect(importHighlightsMock).toHaveBeenCalled();
      expect(NoticeMock).toHaveBeenCalledWith('Apple Books highlights imported successfully');
    });

    test('Should throw error notice if import fails on ribbon icon click if backup setting is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ backup: true } as any);
      importHighlightsMock.mockRejectedValueOnce(new Error('Import failed'));
      await plugin.onload();
      const callback = mockAddRibbonIcon.mock.calls[0][2];
      await callback({} as any);
      expect(backupAllHighlightsMock).toHaveBeenCalled();
      expect(importHighlightsMock).toHaveBeenCalled();
      expect(NoticeMock).toHaveBeenCalledWith('[Apple Books Test Mock]:\nError importing highlights. Check console for details (⌥ ⌘ I)', 0);
    });

    test('Should show OverwriteBookModal on ribbon icon click if backup setting is disabled', async () => {
      mockLoadData.mockResolvedValueOnce({ backup: false } as any);

      const openMock = vi.fn();
      const { OverwriteBookModal } = await import('../../src/modals/overwriteConsent');
      vi.spyOn(OverwriteBookModal.prototype, 'open').mockImplementation(openMock);

      await plugin.onload();
      const callback = mockAddRibbonIcon.mock.calls[0][2];
      await callback({} as any);
      expect(openMock).toHaveBeenCalled();
    });
  });

  describe('Import all highlights command', () => {
    test('Should backup and import all highlights on addImportAllBooksCommand if backup setting is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ backup: true } as any);
      importHighlightsMock.mockResolvedValueOnce(aggregatedBooksAndAnnotations);
      await plugin.onload();

      const commandCallback = mockAddCommand.mock.calls[0][0].callback;
      await commandCallback({} as any);
      expect(backupAllHighlightsMock).toHaveBeenCalled();
      expect(importHighlightsMock).toHaveBeenCalled();
    });

    test('Should throw error notice if import fails on addImportAllBooksCommand if backup setting is enabled', async () => {
      mockLoadData.mockResolvedValueOnce({ backup: true } as any);
      importHighlightsMock.mockRejectedValueOnce(new Error('Import failed'));
      await plugin.onload();

      const commandCallback = mockAddCommand.mock.calls[0][0].callback;
      await commandCallback({} as any);
      expect(backupAllHighlightsMock).toHaveBeenCalled();
      expect(importHighlightsMock).toHaveBeenCalled();
      expect(NoticeMock).toHaveBeenCalledWith('[Apple Books Test Mock]:\nError importing highlights. Check console for details (⌥ ⌘ I)', 0);
    });

    test('Should show OverwriteBookModal on addImportAllBooksCommand if backup setting is disabled', async () => {
      mockLoadData.mockResolvedValueOnce({ backup: false } as any);

      const openMock = vi.fn();
      const { OverwriteBookModal } = await import('../../src/modals/overwriteConsent');
      vi.spyOn(OverwriteBookModal.prototype, 'open').mockImplementation(openMock);

      await plugin.onload();
      const commandCallback = mockAddCommand.mock.calls[0][0].callback;
      await commandCallback({} as any);
      expect(openMock).toHaveBeenCalled();
    });

    test.todo('Trigger import via keyboard shortcut/command palette');
  });
  describe('Import from a specific book command', () => {
    test('Should show book search modal on addImportOneBookCommand', async () => {
      mockLoadData.mockResolvedValueOnce({} as any);

      const openMock = vi.fn();
      const { IBookHighlightsPluginSearchModal } = await import('../../src/modals/searchSuggestions');
      vi.spyOn(IBookHighlightsPluginSearchModal.prototype, 'open').mockImplementation(openMock);
      await plugin.onload();

      const commandCallback = mockAddCommand.mock.calls[1][0].callback;
      await commandCallback({} as any);
      expect(openMock).toHaveBeenCalled();
    });

    test('Should throw error notice if import fails on addImportOneBookCommand', async () => {
      mockLoadData.mockResolvedValueOnce({} as any);
      const { IBookHighlightsPluginSearchModal } = await import('../../src/modals/searchSuggestions');
      vi.spyOn(IBookHighlightsPluginSearchModal.prototype, 'open').mockImplementation(() => {
        throw new Error('Import failed');
      });
      await plugin.onload();

      const commandCallback = mockAddCommand.mock.calls[1][0].callback;
      await commandCallback({} as any);
      expect(NoticeMock).toHaveBeenCalledWith('[Apple Books Test Mock]:\nError importing highlights. Check console for details (⌥ ⌘ I)', 0);
    });

    test.todo('Trigger import via keyboard shortcut/command palette');
    test.todo('Settings: UI interaction (changing settings, validation, reset to defaults).');
  });
});
