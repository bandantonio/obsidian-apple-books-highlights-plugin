import type { IBookHighlightsPluginSettings } from './types';
import { aggregateBooksWithAnnotations } from './modules/annotationsProcessing';
import { compileTemplate } from './modules/templateProcessing';
import { VaultManagement } from './modules/vaultManagement';
import { getKeepMeSectionDataFromSettings, embedKeepMeSectionDataIntoBookFile } from './utils/manageKeepMeSection';
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
    const preCompiledContent = precompiledTemplate(bookWithAnnotations);
    const compiledFilename = precompiledFilenameTemplate(bookWithAnnotations);

    const keepMeSectionData = getKeepMeSectionDataFromSettings(compiledFilename, settings);

    let compiledContent = preCompiledContent;

    if (keepMeSectionData) {
      compiledContent = embedKeepMeSectionDataIntoBookFile(keepMeSectionData, preCompiledContent, settings);
    }

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

  const results = await Promise.allSettled(fileOperations);

  const rejected = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');

  if (rejected.length > 0) {
    const aggregatedError = new Error(`Apple Books - Import Highlights: ${rejected.length} file operation(s) failed during import.`);

    (aggregatedError as any).causes = rejected.map((r) => r.reason);
    throw aggregatedError;
  }
};
