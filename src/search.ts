import { App, Notice, SuggestModal } from 'obsidian';
import IBookHighlightsPlugin from '../main';
import { ICombinedBooksAndHighlights } from './types';
import { aggregateBookAndHighlightDetails } from './methods/aggregateDetails';
abstract class IBookHighlightsPluginSuggestModal extends SuggestModal<ICombinedBooksAndHighlights> {
    plugin: IBookHighlightsPlugin;
    constructor(
        app: App,
        plugin: IBookHighlightsPlugin) {
        super(app);
        this.plugin = plugin;
    }
}

export class IBookHighlightsPluginSearchModal extends IBookHighlightsPluginSuggestModal {
    async getSuggestions(query: string): Promise<ICombinedBooksAndHighlights[] > {
		try {
			const allBooks = await aggregateBookAndHighlightDetails();

			return allBooks.filter(book => {
				const titleMatch = book.bookTitle.toLowerCase().includes(query.toLowerCase());
				const authorMatch = book.bookAuthor.toLowerCase().includes(query.toLowerCase());

				return titleMatch || authorMatch;
			});
		} catch (error) {
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
    onChooseSuggestion(item: ICombinedBooksAndHighlights, event: MouseEvent | KeyboardEvent) {
		this.plugin.saveHighlightsToVault([item]);
    }
}
