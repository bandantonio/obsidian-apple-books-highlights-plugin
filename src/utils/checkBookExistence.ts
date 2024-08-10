import { Vault } from 'obsidian';
import path from 'path';
import { AppleBooksHighlightsImportPluginSettings } from '../settings';

export const checkBookExistence = (bookTitle: string, vault: Vault, settings: AppleBooksHighlightsImportPluginSettings): boolean => {
    const pathToBookFile = path.join(settings.highlightsFolder, `${bookTitle}.md`);
    const doesBookFileExist = vault.getFileByPath(pathToBookFile);

    return doesBookFileExist ? true : false;
};