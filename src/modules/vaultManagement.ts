import type { App, Vault, TFolder, TFile } from 'obsidian';
import { compileTemplate } from './templateProcessing';
import type { IBookHighlightsPluginSettings, IBookWithAnnotations } from '../types';
import path from 'path';

export class VaultManagement {
  private app: App;
  private vault: Vault;
  private settings: IBookHighlightsPluginSettings;
  constructor(app: App, settings: IBookHighlightsPluginSettings) {
    this.app = app;
    this.vault = this.app.vault;
    this.settings = settings;
  }

  getHighlightsFolder(): string {
    return this.settings.highlightsFolder;
  }
  
  getHighlightsFolderPath(): TFolder | null {
    const folderPath = this.getHighlightsFolder();
    
    const checkPath = this.vault.getFolderByPath(folderPath);
    return checkPath;
  };
  
  getFilePath(filenameTemplate: string): TFile | null {
    const filePath = path.join(this.getHighlightsFolder(), `${filenameTemplate}.md`);
    
    const result = this.vault.getFileByPath(filePath);
    
    return result;
  }
  
  async createHighlightsFolder(): Promise<void> {
    const highlightsFolderPath = this.getHighlightsFolderPath();
    
    if (!highlightsFolderPath) {
      this.vault.createFolder(this.getHighlightsFolder());
    }
  }
      
  async createBookFile(filename: string, content: string): Promise<void> {
    const filePath = path.join(this.getHighlightsFolder(), `${filename}.md`);
    
    await this.vault.create(filePath, content);
  }
  
  async modifyBookFile(file: TFile, content: string): Promise<void> {
    await this.vault.modify(file, content);
  }
  
  async backupAllHighlights(): Promise<void> {
    console.time('backing-up-existing-highlights');
    const highlightsFolderPath = this.getHighlightsFolderPath();
    
    if (highlightsFolderPath) {
      const files = (await this.vault.adapter.list(highlightsFolderPath.path)).files;
      
      if (files.length > 0) {
        const highlightsBackupFolderName = `${this.getHighlightsFolder()}-bk-${Date.now()}`;
        await this.vault.adapter.rename(highlightsFolderPath.path, highlightsBackupFolderName);
      }
    }
    console.timeEnd('backing-up-existing-highlights');
  }
  
  async backupBookFile(file: TFile): Promise<void> {
    const backupFileName = `${file.basename}-bk-${Date.now()}.md`;
    await this.vault.adapter.rename(file.path, path.join(this.getHighlightsFolder(), backupFileName));
  }
}
