import { App, Notice, SuggestModal } from 'obsidian';
import IBookHighlightsPlugin from '../main';
import { CombinedHighlight } from './types';

abstract class IBookHighlightsPluginSuggestModal extends SuggestModal<CombinedHighlight> {
    plugin: IBookHighlightsPlugin;
    constructor(
        app: App,
        plugin: IBookHighlightsPlugin) {
        super(app);
        this.plugin = plugin;
    } 
}

export class IBookHighlightsPluginSearchModal extends IBookHighlightsPluginSuggestModal {
    async getSuggestions(query: string): Promise<CombinedHighlight[]> {
        const allBooks = await this.plugin.importHighlights();
        return allBooks.filter(book => {
            const titleMatch = book.bookTitle.toLowerCase().includes(query.toLowerCase());
            const authorMatch = book.bookAuthor.toLowerCase().includes(query.toLowerCase());
            
            return titleMatch || authorMatch;
        });
    }

    renderSuggestion(value: CombinedHighlight, el: HTMLElement) {
        el.createEl('div', { text: value.bookTitle });
        el.createEl('small', { text: value.bookAuthor });
    }

    onChooseSuggestion(item: CombinedHighlight, event: MouseEvent | KeyboardEvent) {
        this.plugin.saveHighlightsToVault([item]);
        
    }
}