import { App, Modal, Notice, Setting, SuggestModal } from 'obsidian';
import IBookHighlightsPlugin from '../main';
import { ICombinedBooksAndHighlights } from './types';
import { aggregateBookAndHighlightDetails } from './methods/aggregateDetails';
import { checkBookExistence } from './utils/checkBookExistence';

abstract class IBookHighlightsPluginSuggestModal extends SuggestModal<ICombinedBooksAndHighlights> {
    plugin: IBookHighlightsPlugin;
    constructor(
        app: App,
        plugin: IBookHighlightsPlugin
    ) {
        super(app);
        this.plugin = plugin;
    }
}

export class IBookHighlightsPluginSearchModal extends IBookHighlightsPluginSuggestModal {
    async getSuggestions(query: string): Promise<ICombinedBooksAndHighlights[]> {
        try {
            const allBooks = await aggregateBookAndHighlightDetails();

            return allBooks.filter(book => {
                const titleMatch = book.bookTitle.toLowerCase().includes(query.toLowerCase());
                const authorMatch = book.bookAuthor.toLowerCase().includes(query.toLowerCase());

                return titleMatch || authorMatch;
            });
        }
        catch (error) {
            new Notice(`[${this.plugin.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
            console.error(`[${this.plugin.manifest.name}]: ${error}`);
            return [];
        }
    }

    renderSuggestion(value: ICombinedBooksAndHighlights, el: HTMLElement) {
        el.createEl('div', { text: value.bookTitle });
        el.createEl('small', { text: value.bookAuthor });
    }

    //eslint-disable-next-line
    async onChooseSuggestion(item: ICombinedBooksAndHighlights, event: MouseEvent | KeyboardEvent) {
        const doesBookFileExist = checkBookExistence(item.bookTitle, this.app.vault, this.plugin.settings);

        const isBackupEnabled = this.plugin.settings.backup;

        if (!doesBookFileExist && !isBackupEnabled ||
            !doesBookFileExist && isBackupEnabled
        ) {
            this.plugin.saveHighlights.saveSingleBookHighlightsToVault([item], true);

        } else if (doesBookFileExist && !isBackupEnabled) {
            new OverwriteBookModal(this.app, this.plugin, item).open();

        } else if (doesBookFileExist && isBackupEnabled) {
            this.plugin.saveHighlights.saveSingleBookHighlightsToVault([item], false);
        } else {
            this.plugin.saveHighlights.saveSingleBookHighlightsToVault([item], true);
        }
    }
}

// This class is used to display a modal that asks for the user's consent
// to overwrite the existing book in the highlights folder
// It takes an optional `item` parameter with the selected book highlights
// When the parameter is not provided, the modal asks for the consent
// to overwrite all the books
export class OverwriteBookModal extends Modal {
    plugin: IBookHighlightsPlugin;
    item?: ICombinedBooksAndHighlights;

    constructor(
        app: App,
        plugin: IBookHighlightsPlugin,
        item?: ICombinedBooksAndHighlights
    ) {
        super(app);
        this.plugin = plugin;
        this.item = item;
    }

    onOpen() {
        const { contentEl } = this;
        const bookToOverwrite = this.item;

        if (bookToOverwrite) {
            contentEl.createEl('p', { text: `The selected book already exists in your highlights folder:` });
            contentEl.createEl('p', { text: `${bookToOverwrite.bookTitle}`, cls: 'modal-rewrite-book-title'});
            contentEl.createEl('p', { text: 'Would you like to proceed with the overwrite?' });
        } else {
            contentEl.createEl('span', { text: `Bulk import will overwrite` });
            contentEl.createEl('span', { text: ` ALL THE BOOKS `, cls: 'modal-rewrite-all-books' });
            contentEl.createEl('span', { text: `in your highlights folder` });
            contentEl.createEl('p', { text: 'Would you like to proceed with the overwrite?' });
        }

        new Setting(contentEl)
            .addButton(YesButton => {
                YesButton.setButtonText('Yes')
                    .setCta()
                    .onClick(() => {
                        bookToOverwrite
                            ? this.plugin.saveHighlights.saveSingleBookHighlightsToVault([bookToOverwrite], false)
                            : this.plugin.aggregateAndSaveHighlights();

                        this.close();
                    });
            })

            .addButton(NoButton => {
                NoButton.setButtonText('No')
                .onClick(() => {
                    this.close();
                });
            });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}