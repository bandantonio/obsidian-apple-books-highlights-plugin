import type { App, TFile, TFolder, Vault } from 'obsidian';
import path from 'path';
import { defaultPluginSettings } from '../settings';
import type { IBookHighlightsPluginSettings, ICombinedBooksAndHighlights, IRenderService, IVaultService } from '../types';

export class VaultService implements IVaultService {
  private app: App;
  private vault: Vault;
  private settings: IBookHighlightsPluginSettings = defaultPluginSettings;
  private renderService: IRenderService;

  constructor(app: App, settings: IBookHighlightsPluginSettings, renderService: IRenderService) {
    this.app = app;
    this.settings = settings;
    this.renderService = renderService;
    this.vault = this.app.vault;
  }

  getHighlightsFolder(): TFolder | null {
    return this.vault.getFolderByPath(this.settings.highlightsFolder);
  }

  checkFileExistence(filePath: string): TFile | null {
    return this.vault.getFileByPath(filePath);
  }

  checkBookExistence(item: ICombinedBooksAndHighlights): boolean {
    const renderedFilename = this.renderService.renderTemplate(item, this.settings.filenameTemplate);
    const pathToBookFile = path.join(this.settings.highlightsFolder, `${renderedFilename}.md`);
    const doesBookFileExist = this.vault.getFileByPath(pathToBookFile);

    return Boolean(doesBookFileExist);
  }

  async createNewBookFile(filePath: string, content: string): Promise<void> {
    await this.vault.create(filePath, content);
  }

  async modifyExistingBookFile(file: TFile, content: string): Promise<void> {
    await this.vault.modify(file, content);
  }

  async createHighlightsFolder() {
    await this.vault.createFolder(this.settings.highlightsFolder);
  }

  async recreateHighlightsFolder(highlightsFolderPath?: TFolder | null) {
    // This function is called on successful check of the folder existence,
    // so the folderPath will never be null (that's why there is non-null assertion operator at the end)
    const highlightsFolder = highlightsFolderPath ?? this.getHighlightsFolder();

    await this.vault.delete(highlightsFolder!, true);
    await this.vault.createFolder(this.settings.highlightsFolder);
  }

  async backupAllHighlights(highlightsFolderPath?: TFolder | null): Promise<void> {
    const highlightsFolder = highlightsFolderPath ?? this.getHighlightsFolder();

    if (!highlightsFolder) {
      return;
    }

    // adapter.list returns only files that are direct children of the highlights folder.
    // Only these files will be backed up.
    const highlightsFilesToBackup = (await this.vault.adapter.list(highlightsFolder.path)).files;

    if (highlightsFilesToBackup.length > 0) {
      const highlightsBackupFolder = `${this.settings.highlightsFolder}-bk-${Date.now()}`;

      await this.vault.createFolder(highlightsBackupFolder);

      // Instead of copying, it would be easier to move all the contents to the highlightsBackupFolder,
      // but Obsidian API does not have a method to do it,
      // so, the workaround is to copy those files.
      for (const file of highlightsFilesToBackup) {
        const fileName = path.basename(file);
        await this.vault.adapter.copy(file, path.join(highlightsBackupFolder, fileName));
      }

      // Remove the highlights folder with all its contents
      // and recreate it again for the subsequent import
      await this.vault.delete(highlightsFolder, true);
      await this.vault.createFolder(this.settings.highlightsFolder);
    }
  }

  async backupSingleBookHighlights(filename: string): Promise<void> {
    const bookFilePathToBackup = path.join(this.settings.highlightsFolder, `${filename}.md`);
    const vaultFile = this.vault.getFileByPath(bookFilePathToBackup);

    // File may not exist in case when the user changed the filename template between imports of the same book
    if (!vaultFile) {
      return;
    }

    const backupBookTitle = `${filename}-bk-${Date.now()}.md`;

    await this.vault.adapter.copy(vaultFile.path, path.join(this.settings.highlightsFolder, backupBookTitle));
  }
}
