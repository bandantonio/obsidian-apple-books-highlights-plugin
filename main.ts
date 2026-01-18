import { Notice, Plugin } from 'obsidian';
import SaveHighlights from './src/saveHighlightsToVault';
import { IBookHighlightsPluginSearchModal, OverwriteBookModal } from './src/search';
import { DataService } from './src/services/dataService';
import { HighlightProcessingService } from './src/services/highlightProcessingService';
import { RenderService } from './src/services/renderService';
import { VaultService } from './src/services/vaultService';
import { defaultPluginSettings, IBookHighlightsSettingTab } from './src/settings';
import type { IBookHighlightsPluginSettings } from './src/types';
import { DiagnosticsCollector } from './src/utils/diagnostics';
import { Timer } from './src/utils/timing';
export default class IBookHighlightsPlugin extends Plugin {
  settings: IBookHighlightsPluginSettings;
  dataService: DataService;
  highlightProcessingService: HighlightProcessingService;
  renderService: RenderService;
  saveHighlights: SaveHighlights;
  vaultService: VaultService;
  diagnosticsCollector: DiagnosticsCollector;

  async onload() {
    const settings = await this.loadSettings();
    this.diagnosticsCollector = new DiagnosticsCollector(this.app, this.settings);
    this.dataService = new DataService(this.diagnosticsCollector);
    this.highlightProcessingService = new HighlightProcessingService(this.dataService, this.diagnosticsCollector);
    this.renderService = new RenderService(this.diagnosticsCollector);
    this.vaultService = new VaultService(this.app, this.settings, this.renderService, this.diagnosticsCollector);
    this.saveHighlights = new SaveHighlights(this.app, this.settings, this.renderService, this.diagnosticsCollector);

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
    this.settings = { ...defaultPluginSettings, ...(await this.loadData()) };

    return this.settings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async aggregateAndSaveHighlights(): Promise<void> {
    // Reset diagnostics collector for each import run
    this.diagnosticsCollector.reset();

    const timer = new Timer('Full Import Cycle (aggregateAndSaveHighlights)', this.diagnosticsCollector);
    timer.start();

    const highlights = await this.highlightProcessingService.aggregateHighlights();

    if (highlights.length === 0) {
      throw 'No highlights found. Make sure you made some highlights in your Apple Books.';
    }

    // Set counts for diagnostics
    const totalHighlights = highlights.reduce((sum, book) => sum + book.annotations.length, 0);
    this.diagnosticsCollector.setCounts(highlights.length, totalHighlights);

    await this.saveHighlights.saveAllBooksHighlightsToVault(highlights);

    timer.end();
  }
}
