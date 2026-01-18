import { describe, expect, test } from 'vitest';
import { defaultPluginSettings, defaultTemplate } from '../src/settings';
import type { IBookHighlightsPluginSettings } from '../src/types';

const settings: IBookHighlightsPluginSettings = { ...defaultPluginSettings };

describe('Plugin default settings', () => {
  test('Highlights folder', () => {
    expect(settings.highlightsFolder).toEqual('ibooks-highlights');
  });

  test('Import highlights on start', () => {
    expect(settings.importOnStart).toBeFalsy();
  });

  test('Backup highlights', () => {
    expect(settings.backup).toBeFalsy();
  });

  test('Highlights sorting criterion', () => {
    expect(settings.highlightsSortingCriterion).toEqual('creationDateOldToNew');
  });

  test('Template', () => {
    expect(settings.template).toEqual(defaultTemplate);
  });

  test('Filename template', () => {
    expect(settings.filenameTemplate).toEqual('{{{bookTitle}}}');
  });
});
