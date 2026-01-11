import type { Vault } from 'obsidian';
import path from 'path';
import { renderHighlightsTemplate } from '../methods/renderHighlightsTemplate';
import type { AppleBooksHighlightsImportPluginSettings } from '../settings';
import type { ICombinedBooksAndHighlights } from '../types';

export const checkBookExistence = async (
  item: ICombinedBooksAndHighlights,
  vault: Vault,
  settings: AppleBooksHighlightsImportPluginSettings,
): Promise<boolean> => {
  const renderedFilename = await renderHighlightsTemplate(item, settings.filenameTemplate);
  const pathToBookFile = path.join(settings.highlightsFolder, `${renderedFilename}.md`);
  const doesBookFileExist = vault.getFileByPath(pathToBookFile);

  return doesBookFileExist ? true : false;
};
