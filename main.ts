import { Notice, Plugin } from 'obsidian';
// import { aggregateBooksWithAnnotations } from './src/modules/annotationsProcessing';
import { importHighlights } from './src/importHighlights';
import { VaultManagement } from './src/modules/vaultManagement';
import { IBookHighlightsPluginSearchModal } from './src/modals/searchSuggestions';
import { OverwriteBookModal } from './src/modals/overwriteConsent';
import { defaultPluginSettings, IBookHighlightsSettingTab } from './src/settings';
import type { IBookHighlightsPluginSettings } from './src/types';

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
      await importHighlights(this.vault, settings);
    }
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: The block is required for the plugin lifecycle.
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
    if (settings.backup) {
      try {
        await plugin.vault.backupAllHighlights();
        await importHighlights(plugin.vault, settings)
          .then(() => {
            new Notice('Apple Books highlights imported successfully');
          })
      } catch(error) {
        new Notice(`[${plugin.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
        console.error(`[${plugin.manifest.name}]: ${error}`);
      }
    } else {
      new OverwriteBookModal(plugin.app, plugin).open();
    }
  });
}

function addImportAllBooksCommand(plugin: IBookHighlightsPlugin, settings: IBookHighlightsPluginSettings) {
  plugin.addCommand({
    id: 'import-all-highlights',
    name: 'Import all',
    callback: async () => {
      if (plugin.settings.backup) {
        try {
          await plugin.vault.backupAllHighlights();
          // this.settings.backup ? await this.aggregateAndSaveHighlights() : new OverwriteBookModal(this.app, this).open();
          await importHighlights(plugin.vault, settings);
        } catch (error) {
          new Notice(`[${plugin.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
          console.error(`[${plugin.manifest.name}]: ${error}`);
        }
      }
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
      } catch (error) {
        new Notice(`[${plugin.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
        console.error(`[${plugin.manifest.name}]: ${error}`);
      }
    },
  });
}
