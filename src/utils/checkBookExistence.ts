import type { Vault } from 'obsidian';
import path from 'path';
import { RenderService } from '../services/renderService';
import type { AppleBooksHighlightsImportPluginSettings } from '../settings';
import type { ICombinedBooksAndHighlights } from '../types';

export const checkBookExistence = async (
  item: ICombinedBooksAndHighlights,
  vault: Vault,
  settings: AppleBooksHighlightsImportPluginSettings,
): Promise<boolean> => {
  const renderService = new RenderService();
  const renderedFilename = await renderService.renderTemplate(item, settings.filenameTemplate);
  const pathToBookFile = path.join(settings.highlightsFolder, `${renderedFilename}.md`);
  const doesBookFileExist = vault.getFileByPath(pathToBookFile);

  return doesBookFileExist ? true : false;
};
