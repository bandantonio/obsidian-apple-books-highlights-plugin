import { type App, Modal, Setting, TFile } from 'obsidian';
import type IBookHighlightsPlugin from '../../main';
import { importHighlights } from '../importHighlights';
import { showFailedImportNotice, showSuccessfulImportNotice, showErrorInConsole } from '../utils/notificationCenter';

// This class is used to display a modal that asks for the user's consent
// to overwrite the existing book in the highlights folder
// It takes an optional `item` parameter with the selected book highlights
// When the parameter is not provided, the modal asks for the consent
// to overwrite all the books
export class OverwriteBookModal extends Modal {
  plugin: IBookHighlightsPlugin;
  fileDetails?: { file: TFile; compiledContent: string };

  constructor(app: App, plugin: IBookHighlightsPlugin, fileDetails?: { file: TFile; compiledContent: string }) {
    super(app);
    this.plugin = plugin;
    this.fileDetails = fileDetails;
  }

  onOpen() {
    const { contentEl } = this;
    const bookToOverwrite = this.fileDetails;

    if (bookToOverwrite) {
      contentEl.createEl('p', { text: 'The selected book already exists in your highlights folder:' });
      contentEl.createEl('p', { text: `${bookToOverwrite.file.name}`, cls: 'modal-rewrite-book-title' });
      contentEl.createEl('p', { text: 'Would you like to proceed with the overwrite?' });
    } else {
      contentEl.createSpan({ text: 'Bulk import will overwrite' });
      contentEl.createSpan({ text: ' ALL THE BOOKS ', cls: 'modal-rewrite-all-books' });
      contentEl.createSpan({ text: 'in your highlights folder' });
      contentEl.createEl('p', { text: 'Would you like to proceed with the overwrite?' });
    }

    new Setting(contentEl)
      .addButton((YesButton) => {
        YesButton.setButtonText('Yes, overwrite')
          .setCta()
          .onClick(async () => {
            try {
              if (bookToOverwrite) {
                await this.plugin.vault.modifyBookFile(bookToOverwrite.file, bookToOverwrite.compiledContent);
              } else {
                await importHighlights(this.plugin.vault, this.plugin.settings, 'modify');
              }
              showSuccessfulImportNotice();
              this.close();
            } catch (error) {
              showFailedImportNotice(this.plugin.manifest.name);
              showErrorInConsole(this.plugin.manifest.name, error);
            }
          });
      })

      .addButton((NoButton) => {
        NoButton.setButtonText('No').onClick(() => {
          this.close();
        });
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
