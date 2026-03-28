import type { IBookHighlightsPluginSettings } from './types';
import { aggregateBooksWithAnnotations } from './modules/annotationsProcessing';
import { compileTemplate } from './modules/templateProcessing';
import { VaultManagement } from './modules/vaultManagement';

export const importHighlights = async (
  vault: VaultManagement,
  settings: IBookHighlightsPluginSettings,
  importMode: 'create' | 'modify' = 'create',
) => {
  const doesHighlightsFolderExist = Boolean(vault.getHighlightsFolderPath());

  if (!doesHighlightsFolderExist) {
    await vault.createHighlightsFolder();
  }

  const aggregatedBooksAndAnnotations = await aggregateBooksWithAnnotations(settings.highlightsSortingCriterion);

  const precompiledTemplate = compileTemplate(settings.template);
  const precompiledFilenameTemplate = compileTemplate(settings.filenameTemplate);

  const fileOperations = [];

  for await (const bookWithAnnotations of aggregatedBooksAndAnnotations) {
    const compiledContent = precompiledTemplate(bookWithAnnotations);
    const compiledFilename = precompiledFilenameTemplate(bookWithAnnotations);

    if (importMode === 'create') {
      fileOperations.push(vault.createBookFile(compiledFilename, compiledContent));
    } else if (importMode === 'modify') {
      const filePath = vault.getFilePath(compiledFilename);

      if (filePath) {
        fileOperations.push(vault.modifyBookFile(filePath, compiledContent));
      } else {
        console.warn(
          `Apple Books - Import Highlights: Can't modify "${compiledFilename}". Book does not exist. Creating a new book instead.`,
        );
        fileOperations.push(vault.createBookFile(compiledFilename, compiledContent));
      }
    }
  }

  await Promise.allSettled(fileOperations);
};
