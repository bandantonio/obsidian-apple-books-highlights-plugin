import type { App, TFile } from 'obsidian';
import path from 'path';
import { DataService } from './services/dataService';
import { HighlightProcessingService } from './services/highlightProcessingService';
import { VaultService } from './services/vaultService';
import { defaultPluginSettings } from './settings';
import type { IBookHighlightsPluginSettings, ICombinedBooksAndHighlights, IRenderService } from './types';
import type { DiagnosticsCollector } from './utils/diagnostics';
import { Timer } from './utils/timing';

export default class SaveHighlights {
  private app: App;
  private settings: IBookHighlightsPluginSettings = defaultPluginSettings;
  private highlightProcessingService: HighlightProcessingService;
  private renderService: IRenderService;
  private vaultService: VaultService;
  private diagnosticsCollector?: DiagnosticsCollector;

  constructor(
    app: App,
    settings: IBookHighlightsPluginSettings,
    renderService: IRenderService,
    diagnosticsCollector?: DiagnosticsCollector,
  ) {
    this.app = app;
    this.settings = settings;
    this.diagnosticsCollector = diagnosticsCollector;
    this.highlightProcessingService = new HighlightProcessingService(new DataService(this.diagnosticsCollector), this.diagnosticsCollector);
    this.renderService = renderService;
    this.vaultService = new VaultService(this.app, this.settings, this.renderService, this.diagnosticsCollector);
  }

  async saveAllBooksHighlightsToVault(highlights: ICombinedBooksAndHighlights[]): Promise<void> {
    const cycleTimer = new Timer('Full Save Cycle (saveAllBooksHighlightsToVault)', this.diagnosticsCollector);
    cycleTimer.start();

    const highlightsFolder = this.vaultService.getHighlightsFolder();
    const doesHighlightsFolderExist = Boolean(highlightsFolder);

    const isBackupEnabled = this.settings.backup;

    if (doesHighlightsFolderExist) {
      if (isBackupEnabled) {
        await this.vaultService.backupAllHighlights(highlightsFolder);
      } else {
        await this.vaultService.recreateHighlightsFolder(highlightsFolder);
      }
    } else {
      await this.vaultService.createHighlightsFolder();
    }

    for (const combinedHighlight of highlights) {
      // Order highlights according to the value in settings
      const sortedHighlights = this.highlightProcessingService.sortHighlights(combinedHighlight, this.settings.highlightsSortingCriterion);

      // Render template for highlights and filename based on settings
      const renderedTemplate = this.renderService.renderTemplate(sortedHighlights, this.settings.template);
      const renderedFilenameTemplate = this.renderService.renderTemplate(sortedHighlights, this.settings.filenameTemplate);

      // Save highlights to vault
      const filePath = path.join(this.settings.highlightsFolder, `${renderedFilenameTemplate}.md`);

      await this.vaultService.createNewBookFile(filePath, renderedTemplate);
    }

    cycleTimer.end();

    // Write diagnostics to file if collector is available
    if (this.diagnosticsCollector) {
      await this.diagnosticsCollector.writeDiagnosticsToFile();
    }
  }

  async saveSingleBookHighlightsToVault(highlights: ICombinedBooksAndHighlights[], shouldCreateFile: boolean): Promise<void> {
    const cycleTimer = new Timer('Full Save Cycle (saveSingleBookHighlightsToVault)', this.diagnosticsCollector);
    cycleTimer.start();

    const highlightsFolder = this.vaultService.getHighlightsFolder();
    const doesHighlightsFolderExist = Boolean(highlightsFolder);

    if (!doesHighlightsFolderExist) {
      await this.vaultService.createHighlightsFolder();
    }

    for (const combinedHighlight of highlights) {
      // Order highlights according to the value in settings
      const sortedHighlights = this.highlightProcessingService.sortHighlights(combinedHighlight, this.settings.highlightsSortingCriterion);

      // Render template for highlights and filename based on settings
      const renderedTemplate = this.renderService.renderTemplate(sortedHighlights, this.settings.template);
      const renderedFilenameTemplate = this.renderService.renderTemplate(sortedHighlights, this.settings.filenameTemplate);

      // Save highlights to vault
      const filePath = path.join(this.settings.highlightsFolder, `${renderedFilenameTemplate}.md`);

      if (shouldCreateFile) {
        await this.vaultService.createNewBookFile(filePath, renderedTemplate);
      } else {
        const isBackupEnabled = this.settings.backup;
        const vaultFile = this.vaultService.checkFileExistence(filePath) as TFile;

        if (isBackupEnabled) {
          await this.vaultService.backupSingleBookHighlights(renderedFilenameTemplate);
        }

        await this.vaultService.modifyExistingBookFile(vaultFile, renderedTemplate);
      }
    }

    cycleTimer.end();

    // Write diagnostics to file if collector is available
    if (this.diagnosticsCollector) {
      await this.diagnosticsCollector.writeDiagnosticsToFile();
    }
  }
}
