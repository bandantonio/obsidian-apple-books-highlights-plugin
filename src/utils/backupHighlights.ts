import type { TFile, Vault } from 'obsidian';
import path from 'path';
import type { AppleBooksHighlightsImportPluginSettings } from '../settings';

export default class BackupHighlights {
  private vault: Vault;
  private settings: AppleBooksHighlightsImportPluginSettings;

  constructor(vault: Vault, settings: AppleBooksHighlightsImportPluginSettings) {
    this.vault = vault;
    this.settings = settings;
  }

  async backupAllHighlights(): Promise<void> {
    const highlightsFolder = this.vault.getFolderByPath(this.settings.highlightsFolder);

    if (highlightsFolder) {
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
  }

  async backupSingleBookHighlights(bookTitle: string): Promise<void> {
    const bookFilePathToBackup = path.join(this.settings.highlightsFolder, `${bookTitle}.md`);
    const vaultFile = this.vault.getFileByPath(bookFilePathToBackup) as TFile;

    const backupBookTitle = `${bookTitle}-bk-${Date.now()}.md`;

    await this.vault.adapter.copy(vaultFile.path, path.join(this.settings.highlightsFolder, backupBookTitle));
  }
}
