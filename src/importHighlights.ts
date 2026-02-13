import { aggregateBooksWithAnnotations } from './modules/annotationsProcessing';
import { compileTemplate } from './modules/templateProcessing';
import { VaultManagement } from './modules/vaultManagement';
import type { IBookHighlightsPluginSettings,  } from './types';

export const importHighlights = async (vault: VaultManagement, settings: IBookHighlightsPluginSettings) => {
  const aggregatedBooksAndAnnotations = await aggregateBooksWithAnnotations(settings.highlightsSortingCriterion);
  
  console.time('template-rendering');
  const precompiledTemplate = compileTemplate(settings.template);
  const precompiledFilenameTemplate = compileTemplate(settings.filenameTemplate);  
  console.timeEnd('template-rendering');
  
  const doesHighlightsFolderExist = vault.doesHighlightsFolderExist();
  
  if (!doesHighlightsFolderExist) {
    console.time('creating-highlights-folder');
    await vault.createHighlightsFolder();
    console.timeEnd('creating-highlights-folder');
  }
  
  console.log('highlights', aggregatedBooksAndAnnotations);
  
  const fileOperations = aggregatedBooksAndAnnotations.map(async (bookWithAnnotations) => {
    const compiledContent = precompiledTemplate(bookWithAnnotations);
    const compiledFilename = precompiledFilenameTemplate({ bookTitle: bookWithAnnotations.bookTitle });
  //   console.time(`saving-${compiledFilename}`);
    await vault.createNewBookFile(compiledFilename, compiledContent);
  //   console.timeEnd(`saving-${compiledFilename}`);
  });
  
  console.time('total-saving');
  await Promise.allSettled(fileOperations);
  console.timeEnd('total-saving');
};