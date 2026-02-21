import * as obsidian from 'obsidian';
import { describe, expect, test, vi } from 'vitest';
import type IBookHighlightsPlugin from '../../../main';
import { defaultTemplate, defaultPluginSettings, IBookHighlightsSettingTab } from '../../../src/settings';

describe('Default settings', () => {
  test('Should check that default settings are defined', () => {
    expect(defaultPluginSettings).toBeDefined();
    expect(defaultTemplate).toBeDefined();
  });
  
  test('Should check that default settings have the expected properties', () => {
    expect(defaultPluginSettings).toHaveProperty('highlightsFolder');
    expect(defaultPluginSettings).toHaveProperty('backup');
    expect(defaultPluginSettings).toHaveProperty('importOnStart');
    expect(defaultPluginSettings).toHaveProperty('highlightsSortingCriterion');
    expect(defaultPluginSettings).toHaveProperty('template');
    expect(defaultPluginSettings).toHaveProperty('filenameTemplate');
  });
  
  test('Should check that default settings have the expected default values', () => {
    expect(defaultPluginSettings.highlightsFolder).toBe('ibooks-highlights');
    expect(defaultPluginSettings.backup).toBe(false);
    expect(defaultPluginSettings.importOnStart).toBe(false);
    expect(defaultPluginSettings.highlightsSortingCriterion).toBe('creationDateOldToNew');
    expect(defaultPluginSettings.template).toBe(defaultTemplate);
    expect(defaultPluginSettings.filenameTemplate).toBe('bookTitle');
  });
  
  test('Should check that default template contains the expected variables with proper escaping', () => {
    const expectedVariables = [
      '{{bookTitle}}',
      '{{bookId}}',
      '{{{bookAuthor}}}',
      '{{annotations.length}}',
      '{{#each annotations}}',
      '{{#if chapter}}{{{chapter}}}{{else}}N/A{{/if}}',
      '{{#if contextualText}}{{{contextualText}}}{{else}}N/A{{/if}}',
      '{{{highlight}}}',
      '{{#if note}}{{{note}}}{{else}}N/A{{/if}}',
      '{{#if highlightLocation}}[Apple Books Highlight Link](ibooks://assetid/{{../bookId}}#{{highlightLocation}}){{else}}N/A{{/if}}',
      '{{/each}}'
    ];
    
    expectedVariables.forEach(variable => {
      expect(defaultTemplate).toContain(variable);
    });
  });
});

describe('Settings tab', () => {
  test('Should check that settings tab can be instantiated', () => {
    const mockApp = {} as obsidian.App;
    const mockPlugin = { settings: { ...defaultPluginSettings }, saveSettings: vi.fn() } as unknown as IBookHighlightsPlugin;
    const settingsTab = new IBookHighlightsSettingTab(mockApp, mockPlugin);
    
    expect(settingsTab).toBeInstanceOf(IBookHighlightsSettingTab);
    expect(settingsTab.plugin).toBe(mockPlugin);
  });
  
  test.skip('Should check that settings tab registers all the expected settings', () => {
    const mockApp = {} as obsidian.App;
    const mockPlugin = { settings: { ...defaultPluginSettings }, saveSettings: vi.fn() } as unknown as IBookHighlightsPlugin;
    const settingsTab = new IBookHighlightsSettingTab(mockApp, mockPlugin);
    
    const mockContainerEl = {} as HTMLElement;
    
    const addHighlightsFolderSettingSpy = vi.spyOn(settingsTab, 'addHighlightsFolderSetting');
    const addImportOnStartSettingSpy = vi.spyOn(settingsTab, 'addImportOnStartSetting');
    const addBackupSettingSpy = vi.spyOn(settingsTab, 'addBackupSetting');
    const addHighlightsSortingCriterionSettingSpy = vi.spyOn(settingsTab, 'addHighlightsSortingCriterionSetting');
    const addTemplateSettingSpy = vi.spyOn(settingsTab, 'addTemplateSetting');
    const addFilenameTemplateSettingSpy = vi.spyOn(settingsTab, 'addFilenameTemplateSetting');
    const addResetTemplateSettingSpy = vi.spyOn(settingsTab, 'addResetTemplateSetting');
    
    // Assign the mock containerEl directly before calling display
    settingsTab.containerEl = mockContainerEl;
    // Call the display method to trigger the settings registration
    // settingsTab.display();
    
    // Check that all the expected settings methods were called
    expect(addHighlightsFolderSettingSpy).toHaveBeenCalledWith(mockContainerEl);
    expect(addImportOnStartSettingSpy).toHaveBeenCalledWith(mockContainerEl);
    expect(addBackupSettingSpy).toHaveBeenCalledWith(mockContainerEl);
    expect(addHighlightsSortingCriterionSettingSpy).toHaveBeenCalledWith(mockContainerEl);
    expect(addTemplateSettingSpy).toHaveBeenCalledWith(mockContainerEl);
    expect(addFilenameTemplateSettingSpy).toHaveBeenCalledWith(mockContainerEl);
    expect(addResetTemplateSettingSpy).toHaveBeenCalledWith(mockContainerEl);
  });
});