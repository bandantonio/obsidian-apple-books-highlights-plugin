import type { App, TFile } from 'obsidian';
import path from 'path';
import { DataService } from './services/dataService';
import { HighlightProcessingService } from './services/highlightProcessingService';
import { VaultService } from './services/vaultService';
import type { AppleBooksHighlightsImportPluginSettings } from './settings';
import type { ICombinedBooksAndHighlights, IRenderService } from './types';

export default class SaveHighlights {
  private app: App;
  private settings: AppleBooksHighlightsImportPluginSettings;
  private highlightProcessingService: HighlightProcessingService;
  private renderService: IRenderService;
  private vaultService: VaultService;

  constructor(app: App, settings: AppleBooksHighlightsImportPluginSettings, renderService: IRenderService) {
    this.app = app;
    this.settings = settings;
    this.highlightProcessingService = new HighlightProcessingService(new DataService());
    this.renderService = renderService;
    this.vaultService = new VaultService(this.app, this.settings, this.renderService);
  }

  async saveAllBooksHighlightsToVault(highlights: ICombinedBooksAndHighlights[]): Promise<void> {
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
  }

  async saveSingleBookHighlightsToVault(highlights: ICombinedBooksAndHighlights[], shouldCreateFile: boolean): Promise<void> {
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
  }
}
