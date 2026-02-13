import type { App, Vault } from 'obsidian';
import type { IBookHighlightsPluginSettings } from '../types';
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
  
  doesHighlightsFolderExist(): boolean {
    const folderPath = this.getHighlightsFolder();
    const folder = this.vault.getFolderByPath(folderPath);
    
    return Boolean(folder);
  }
  
  async createHighlightsFolder(): Promise<void> {
    const folderPath = this.getHighlightsFolder();
    this.vault.createFolder(folderPath);
  }
      
  async createNewBookFile(filename: string, content: string): Promise<void> {
    
    const filePath = path.join(this.getHighlightsFolder(), `${filename}.md`);
    
    await this.vault.create(filePath, content);
  }
}
