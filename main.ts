import { Plugin } from 'obsidian';
import type { IBookHighlightsPluginSettings } from './src/types';
import { IBookHighlightsPluginSearchModal } from './src/modals/searchSuggestions';
import { VaultManagement } from './src/modules/vaultManagement';
import { defaultPluginSettings, IBookHighlightsSettingTab } from './src/settings';
import { backupAndImport } from './src/utils/backupAndImportFlow';
import { showFailedImportNotice, showErrorInConsole } from './src/utils/notificationCenter';
export default class IBookHighlightsPlugin extends Plugin {
  vault: VaultManagement;
  settings: IBookHighlightsPluginSettings;

  async onload() {
    const settings = await this.loadSettings();
    this.vault = new VaultManagement(this.app, settings);

    this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));
    addRibbonAction(this, settings);
    addImportAllBooksCommand(this, settings);
    addImportOneBookCommand(this);

    if (settings.importOnStart) {
      this.app.workspace.onLayoutReady(async () => {
        const pluginInstance = this;
        await backupAndImport(pluginInstance, settings, 'modify');
      });
    }
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, defaultPluginSettings, (await this.loadData()) as Partial<IBookHighlightsPluginSettings>);

    return this.settings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

function addRibbonAction(plugin: IBookHighlightsPlugin, settings: IBookHighlightsPluginSettings) {
  plugin.addRibbonIcon('book-open', `${plugin.manifest.name}: Import all`, async () => {
    await backupAndImport(plugin, settings);
  });
}

function addImportAllBooksCommand(plugin: IBookHighlightsPlugin, settings: IBookHighlightsPluginSettings) {
  plugin.addCommand({
    id: 'import-all-highlights',
    name: 'Import all',
    callback: async () => {
      await backupAndImport(plugin, settings);
    },
  });
}

function addImportOneBookCommand(plugin: IBookHighlightsPlugin) {
  plugin.addCommand({
    id: 'import-single-highlights',
    name: 'From a specific book...',
    callback: () => {
      try {
        new IBookHighlightsPluginSearchModal(plugin.app, plugin).open();
      } catch (error: any) {
        showFailedImportNotice(plugin.manifest.name);
        showErrorInConsole(plugin.manifest.name, error);
      }
    },
  });
}
