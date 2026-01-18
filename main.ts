import { Notice, Plugin } from 'obsidian';
import SaveHighlights from './src/saveHighlightsToVault';
import { IBookHighlightsPluginSearchModal, OverwriteBookModal } from './src/search';
import { DataService } from './src/services/dataService';
import { HighlightProcessingService } from './src/services/highlightProcessingService';
import { RenderService } from './src/services/renderService';
import { VaultService } from './src/services/vaultService';
import { AppleBooksHighlightsImportPluginSettings, IBookHighlightsSettingTab } from './src/settings';

export default class IBookHighlightsPlugin extends Plugin {
  settings: AppleBooksHighlightsImportPluginSettings;
  dataService: DataService;
  highlightProcessingService: HighlightProcessingService;
  renderService: RenderService;
  saveHighlights: SaveHighlights;
  vaultService: VaultService;

  async onload() {
    const settings = await this.loadSettings();
    this.dataService = new DataService();
    this.highlightProcessingService = new HighlightProcessingService(this.dataService);
    this.renderService = new RenderService();
    this.vaultService = new VaultService(this.app, this.settings, this.renderService);
    this.saveHighlights = new SaveHighlights(this.app, this.settings, this.renderService);

    if (settings.importOnStart) {
      await this.aggregateAndSaveHighlights();
    }

    this.addRibbonIcon('book-open', this.manifest.name, async () => {
      try {
        this.settings.backup
          ? await this.aggregateAndSaveHighlights()
              .then(() => {
                new Notice('Apple Books highlights imported successfully');
              })
              .catch((error) => {
                new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
                console.error(`[${this.manifest.name}]: ${error}`);
              })
          : new OverwriteBookModal(this.app, this).open();
      } catch (error) {
        console.error(`[${this.manifest.name}]: ${error}`);
      }
    });

    this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));

    this.addCommand({
      id: 'import-all-highlights',
      name: 'Import all',
      callback: async () => {
        try {
          this.settings.backup ? await this.aggregateAndSaveHighlights() : new OverwriteBookModal(this.app, this).open();
        } catch (error) {
          new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
          console.error(`[${this.manifest.name}]: ${error}`);
        }
      },
    });

    this.addCommand({
      id: 'import-single-highlights',
      name: 'From a specific book...',
      callback: () => {
        try {
          new IBookHighlightsPluginSearchModal(this.app, this, this.dataService, this.vaultService).open();
        } catch (error) {
          new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
          console.error(`[${this.manifest.name}]: ${error}`);
        }
      },
    });
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: The block is required for the plugin lifecycle.
  onunload() {}

  async loadSettings() {
    this.settings = Object.assign(new AppleBooksHighlightsImportPluginSettings(), await this.loadData());

    return this.settings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async aggregateAndSaveHighlights(): Promise<void> {
    const highlights = await this.highlightProcessingService.aggregateHighlights();

    if (highlights.length === 0) {
      throw 'No highlights found. Make sure you made some highlights in your Apple Books.';
    }

    await this.saveHighlights.saveAllBooksHighlightsToVault(highlights);
  }
}
