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
  
  const fileOperations = [];
  
  for await (const bookWithAnnotations of aggregatedBooksAndAnnotations) {
    const compiledContent = precompiledTemplate(bookWithAnnotations);
    const compiledFilename = precompiledFilenameTemplate(bookWithAnnotations);
    
    
    if (importMode === "create") {
      console.time(`saving-${compiledFilename}`);
      fileOperations.push(vault.createBookFile(compiledFilename, compiledContent));
      console.timeEnd(`saving-${compiledFilename}`);
      
    } else if (importMode === "modify") {
      const filePath = vault.getFilePath(compiledFilename);
      
      if (filePath) {
        console.time(`modifying-${compiledFilename}`);
        fileOperations.push(vault.modifyBookFile(filePath, compiledContent))
        console.timeEnd(`modifying-${compiledFilename}`);
      } else {
        console.warn(`Apple Books - Import Highlights: Can't modify "${compiledFilename}". Book does not exist. Creating a new book instead.`);
        fileOperations.push(vault.createBookFile(compiledFilename, compiledContent));
      }
    }
  }
  
  console.time('total-saving');
  await Promise.allSettled(fileOperations);
  console.timeEnd('total-saving');
};