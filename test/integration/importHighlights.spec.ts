import fs from 'fs';
import path from 'path';
import { App, TFile } from 'obsidian';
import { afterEach, describe, expect, test, vi } from 'vitest';
import * as annotationProcessing from '../../src/modules/annotationsProcessing';
import aggregatedBooksAndAnnotations from '../fixtures/annotationProcessing/aggregatedBooksAndAnnotations.json' assert { type: 'json' };
import { importHighlights } from '../../src/importHighlights';
import { VaultManagement } from '../../src/modules/vaultManagement';
import type { IBookHighlightsPluginSettings } from '../../src/types';
import { defaultTemplate } from '../../src/settings';

describe('importHighlights', () => {
  const mockApp = {
    vault: {
      getFolderByPath: vi.fn(),
      getFileByPath: vi.fn(),
      createFolder: vi.fn(),
      create: vi.fn(),
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
  };
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  test('Should save aggregated highlights as separate files using default importMode (create)', async () => {
    const vaultManagement = new VaultManagement(mockApp, mockSettings);
    
    vi.spyOn(annotationProcessing, 'aggregateBooksWithAnnotations').mockResolvedValue(aggregatedBooksAndAnnotations);
    
    const createBookFileSpy = vi.spyOn(vaultManagement, 'createBookFile');
    const renderedBookOne = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsOne-default.md'), 'utf-8');
    const renderedBookTwo = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsTwo-default.md'), 'utf-8');
    const renderedBookThree = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsThree-default.md'), 'utf-8');
    const renderedBookFour = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsFour-default.md'), 'utf-8');
    
    await importHighlights(vaultManagement, mockSettings);

    expect(createBookFileSpy).toHaveBeenCalledTimes(4);
    expect(createBookFileSpy).toHaveBeenNthCalledWith(1, "iPhone User Guide", renderedBookOne);
    expect(createBookFileSpy).toHaveBeenNthCalledWith(2, "iPad User Guide", renderedBookTwo);
    expect(createBookFileSpy).toHaveBeenNthCalledWith(3, "Mac User Guide", renderedBookThree);
    expect(createBookFileSpy).toHaveBeenNthCalledWith(4, "A book to test sorting feature", renderedBookFour);
  });
  
  test('Should modify existing files when importMode === modify', async () => {
    const vaultManagement = new VaultManagement(mockApp, mockSettings);
    
    vi.spyOn(annotationProcessing, 'aggregateBooksWithAnnotations').mockResolvedValue([aggregatedBooksAndAnnotations[0]]);
    vi.spyOn(vaultManagement, 'getFilePath').mockReturnValue({ path: 'ibooks-highlights/iPhone User Guide.md' } as TFile);

    const modifyBookFileSpy = vi.spyOn(vaultManagement, 'modifyBookFile');
    const renderedBookOne = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsOne-default.md'), 'utf-8');
    
    await importHighlights(vaultManagement, mockSettings, 'modify');
    
    expect(modifyBookFileSpy).toHaveBeenCalledWith({ path: 'ibooks-highlights/iPhone User Guide.md' }, renderedBookOne);
  });
  
  test('Should create a new file if importMode === modify but the file does not exist', async () => {
    const vaultManagement = new VaultManagement(mockApp, mockSettings);
    
    vi.spyOn(annotationProcessing, 'aggregateBooksWithAnnotations').mockResolvedValue([aggregatedBooksAndAnnotations[0]]);
    vi.spyOn(vaultManagement, 'getFilePath').mockReturnValue(null);

    const createBookFileSpy = vi.spyOn(vaultManagement, 'createBookFile');
    const renderedBookOne = fs.readFileSync(path.join(process.cwd(), 'test', 'fixtures', 'templateProcessing', 'renderedAnnotationsOne-default.md'), 'utf-8');
    
    await importHighlights(vaultManagement, mockSettings, 'modify');
    
    expect(createBookFileSpy).toHaveBeenCalledWith("iPhone User Guide", renderedBookOne);
  });
});