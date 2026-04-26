import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import IBookHighlightsPlugin from '../../main';

describe('quick-preview event', () => {
  let plugin: IBookHighlightsPlugin;
  let handler: any;

  const mockLoadData = vi.fn();
  const mockSaveData = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    plugin = new IBookHighlightsPlugin({} as any, {} as any);
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
        onLayoutReady: vi.fn().mockImplementation(async (cb: () => Promise<void> | void) => await cb()),
        on: vi.fn(),
      },
    } as any;

    mockLoadData.mockResolvedValueOnce({});
    const onMock = plugin.app.workspace.on as any;
    await plugin.onload();

    expect(onMock).toHaveBeenCalledWith('quick-preview', expect.any(Function));
    handler = onMock.mock.calls.find((call: any[]) => call[0] === 'quick-preview')?.[1];
    expect(handler).toBeDefined();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Should call saveKeepMeSectionData and update keepMeSectionData in settings', async () => {
    const file = { path: 'ibooks-highlights/Test Book.md', basename: 'Test Book', parent: { path: 'ibooks-highlights' } };
    const data = 'some content\n%% keep-me %%\nUseful information to preserve between imports\n%% /keep-me %%\nmore content';

    await handler(file, data);

    expect(mockSaveData).toHaveBeenCalledWith(
      expect.objectContaining({
        keepMeSectionData: expect.objectContaining({
          'Test Book': 'Useful information to preserve between imports',
        }),
      }),
    );
  });

  test('Should not save settings if file is outside highlights folder', async () => {
    const file = { path: 'other-folder/Test.md', basename: 'Test' };
    const data = '%% keep-me %%\nUseful information to preserve between imports\n%% /keep-me %%';

    await handler(file, data);

    expect(mockSaveData).not.toHaveBeenCalled();
  });

  test('Should not save settings if file is a backup file', async () => {
    const file = { path: 'ibooks-highlights/Test-Book-bk-12345.md', basename: 'Test-Book-bk-12345', parent: { path: 'ibooks-highlights' } };
    const data = '%% keep-me %%\nUseful information to preserve between imports\n%% /keep-me %%';

    await handler(file, data);

    expect(mockSaveData).not.toHaveBeenCalled();
  });

  test('Should not save settings if no Keep Me section is extracted', async () => {
    const file = { path: 'ibooks-highlights/Test.md', basename: 'Test' };
    const data = 'content without Keep Me section delimiters';

    await handler(file, data);

    expect(mockSaveData).not.toHaveBeenCalled();
  });
});

describe('onExternalSettingsChange', () => {
  test('Should reload settings and reinitialize vault on external settings change', async () => {
    const plugin = new IBookHighlightsPlugin({} as any, {} as any);
    plugin.loadData = vi.fn().mockResolvedValue({ someSetting: 'newValue' });
    plugin.saveData = vi.fn();
    plugin.manifest = { name: 'Apple Books Test Mock' } as any;
    plugin.app = {
      vault: {
        getFolderByPath: vi.fn().mockReturnValue({}),
        getFileByPath: vi.fn(),
        createFolder: vi.fn(),
        create: vi.fn(),
      },
      workspace: {
        onLayoutReady: vi.fn().mockImplementation(async (cb: () => Promise<void> | void) => await cb()),
        on: vi.fn(),
      },
    } as any;

    await plugin.onload();
    await plugin.onExternalSettingsChange();

    expect(plugin.loadData).toHaveBeenCalled();
    expect(plugin.settings).toEqual(expect.objectContaining({ someSetting: 'newValue' }));
    expect(plugin.vault).toBeDefined();
  });
});
