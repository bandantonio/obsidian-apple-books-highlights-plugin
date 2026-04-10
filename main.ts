import { Plugin } from 'obsidian';
import type { IBookHighlightsPluginSettings } from './src/types';
import { IBookHighlightsPluginSearchModal } from './src/modals/searchSuggestions';
import { VaultManagement } from './src/modules/vaultManagement';
import { defaultPluginSettings, IBookHighlightsSettingTab } from './src/settings';
import { backupAndImport } from './src/utils/backupAndImportFlow';
import { saveKeepMeSectionData } from './src/utils/manageKeepMeSection';
import { showFailedImportNotice, showErrorInConsole } from './src/utils/notificationCenter';
export default class IBookHighlightsPlugin extends Plugin {
  vault: VaultManagement;
  settings: IBookHighlightsPluginSettings;

  async onload() {
    await this.loadSettings();
    this.vault = new VaultManagement(this.app, this.settings);

    this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));
    addRibbonAction(this);
    addImportAllBooksCommand(this);
    addImportOneBookCommand(this);

    if (this.settings.importOnStart) {
      this.app.workspace.onLayoutReady(async () => {
        await backupAndImport(this, this.settings, 'modify');
      });
    }

    this.registerEvent(
      this.app.workspace.on('quick-preview', async (file, data) => {
        await saveKeepMeSectionData(file, data, this, this.settings);
      }),
    );
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, defaultPluginSettings, (await this.loadData()) as Partial<IBookHighlightsPluginSettings>);

    return this.settings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onExternalSettingsChange(): Promise<void> {
    await this.loadSettings();
    this.vault = new VaultManagement(this.app, this.settings);
  }
}

function addRibbonAction(plugin: IBookHighlightsPlugin) {
  plugin.addRibbonIcon('book-open', `${plugin.manifest.name}: Import all`, async () => {
    await backupAndImport(plugin, plugin.settings);
  });
}

function addImportAllBooksCommand(plugin: IBookHighlightsPlugin) {
  plugin.addCommand({
    id: 'import-all-highlights',
    name: 'Import all',
    callback: async () => {
      await backupAndImport(plugin, plugin.settings);
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
