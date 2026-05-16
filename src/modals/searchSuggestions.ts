import { type App, SuggestModal } from 'obsidian';
import type IBookHighlightsPlugin from '../../main';
import type { IBookWithAnnotations } from '../types';
import { aggregateBooksWithAnnotations } from '../modules/annotationsProcessing';
import { compileTemplate } from '../modules/templateProcessing';
import { getKeepMeSectionDataFromSettings, embedKeepMeSectionDataIntoBookFile } from '../utils/manageKeepMeSection';
import { showFailedImportNotice, showErrorInConsole } from '../utils/notificationCenter';
import { OverwriteBookModal } from './overwriteConsent';
abstract class IBookHighlightsPluginSuggestModal extends SuggestModal<IBookWithAnnotations> {
  plugin: IBookHighlightsPlugin;
  constructor(app: App, plugin: IBookHighlightsPlugin) {
    super(app);
    this.plugin = plugin;
  }
}

export class IBookHighlightsPluginSearchModal extends IBookHighlightsPluginSuggestModal {
  private firstRetrievedBooksWithAnnotations: Promise<IBookWithAnnotations[]> | null = null;

  async getSuggestions(query: string): Promise<IBookWithAnnotations[]> {
    try {
      if (!this.firstRetrievedBooksWithAnnotations) {
        this.firstRetrievedBooksWithAnnotations = aggregateBooksWithAnnotations(this.plugin.settings.highlightsSortingCriterion);
      }

      const booksWithAnnotations = await this.firstRetrievedBooksWithAnnotations;

      return booksWithAnnotations.filter((book) => {
        const titleMatch = book.bookTitle.toLowerCase().includes(query.toLowerCase());
        const authorMatch = book.bookAuthor.toLowerCase().includes(query.toLowerCase());

        return titleMatch || authorMatch;
      });
    } catch (error) {
      showFailedImportNotice(this.plugin.manifest.name);
      showErrorInConsole(this.plugin.manifest.name, error);
      return [];
    }
  }

  renderSuggestion(book: IBookWithAnnotations, el: HTMLElement) {
    el.createDiv({ text: book.bookTitle });
    el.createEl('small', { text: book.bookAuthor });
  }

  async onChooseSuggestion(book: IBookWithAnnotations) {
    const isBackupEnabled = this.plugin.settings.backup;

    const doesHighlightsFolderExist = Boolean(this.plugin.vault.getHighlightsFolderPath());

    if (!doesHighlightsFolderExist) {
      await this.plugin.vault.createHighlightsFolder();
    }

    const precompiledTemplate = compileTemplate(this.plugin.settings.template);
    const precompiledFilenameTemplate = compileTemplate(this.plugin.settings.filenameTemplate);
    const preCompiledContent = precompiledTemplate(book);
    const compiledFilename = precompiledFilenameTemplate(book);

    const file = this.plugin.vault.getFilePath(compiledFilename);
    const doesBookFileExist = Boolean(file);

    const keepMeSectionContent = getKeepMeSectionDataFromSettings(compiledFilename, this.plugin.settings);

    let compiledContent = preCompiledContent;
    if (keepMeSectionContent) {
      compiledContent = embedKeepMeSectionDataIntoBookFile(keepMeSectionContent, preCompiledContent, this.plugin.settings);
    }

    // File may not exist when the filename template was changed between imports
    // or when the book was renamed to the title that doesn't match the defined template.
    if (!doesBookFileExist) {
      await this.plugin.vault.createBookFile(compiledFilename, compiledContent);
    }

    if (isBackupEnabled && doesBookFileExist) {
      await this.plugin.vault.backupBookFile(file!);
      await this.plugin.vault.createBookFile(compiledFilename, compiledContent);
    }

    if (!isBackupEnabled && doesBookFileExist) {
      const fileDetails = {
        file: file!,
        compiledContent,
      };

      new OverwriteBookModal(this.app, this.plugin, fileDetails).open();
    }
  }
}
