import { aggregateBooksWithAnnotations } from './modules/annotationsProcessing';
import { compileTemplate } from './modules/templateProcessing';
import { VaultManagement } from './modules/vaultManagement';
import type { IBookHighlightsPluginSettings,  } from './types';

export const importHighlights = async (vault: VaultManagement, settings: IBookHighlightsPluginSettings, importMode: "create" | "modify" = "create") => {
  const doesHighlightsFolderExist = Boolean(vault.getHighlightsFolderPath());
  
  if (!doesHighlightsFolderExist) {
    console.time('creating-highlights-folder');
    await vault.createHighlightsFolder();
    console.timeEnd('creating-highlights-folder');
  }
  
  const aggregatedBooksAndAnnotations = await aggregateBooksWithAnnotations(settings.highlightsSortingCriterion);
  
  console.time('template-rendering');
  const precompiledTemplate = compileTemplate(settings.template);
  const precompiledFilenameTemplate = compileTemplate(settings.filenameTemplate);  
  console.timeEnd('template-rendering');
  
  const fileOperations = aggregatedBooksAndAnnotations.map(async (bookWithAnnotations) => {
    const compiledContent = precompiledTemplate(bookWithAnnotations);
    const compiledFilename = precompiledFilenameTemplate(bookWithAnnotations);
    
    if (importMode === "create") {
      // console.time(`saving-${compiledFilename}`);
      await vault.createBookFile(compiledFilename, compiledContent);
      // console.timeEnd(`saving-${compiledFilename}`);
    } else if (importMode === "modify") {
      const filePath = vault.getFilePath(compiledFilename)!;
      
      console.time(`modifying-${compiledFilename}`);
      await vault.modifyBookFile(filePath, compiledContent);
      console.timeEnd(`modifying-${compiledFilename}`);
    }
  });
  
  console.time('total-saving');
  await Promise.allSettled(fileOperations);
  console.timeEnd('total-saving');
};