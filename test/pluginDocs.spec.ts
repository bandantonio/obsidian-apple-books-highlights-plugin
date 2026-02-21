import fs from 'fs/promises';
import path from 'path';
import { describe, expect, test } from 'vitest';
import type { IBook, IAnnotation } from '../src/types';

describe('Plugin documentation', () => {
  test('Check that README.md exists', () => {
    expect(path.join(process.cwd(), 'README.md')).toBeDefined();
  });

  test('Check that Template variables section contains strictly a list of variables defined in IBook', async () => {
    const allowedBookVariables = {
      bookId: 'string',
      bookTitle: 'string',
      bookAuthor: 'string',
      bookGenre: 'string',
      bookLanguage: 'string',
      bookLastOpenedDate: 1234567890,
      bookFinishedDate: 1234567890,
      bookCoverUrl: 'string',
    } as IBook;
    
    const allowedAnnotationVariables = {
      assetId: 'string',
      chapter: 'string',
      contextualText: 'string',
      highlight: 'string',
      note: 'string | null',
      highlightLocation: 'string',
      highlightStyle: 0,
      highlightCreationDate: 1234567890,
      highlightModificationDate: 1234567890,
    } as IAnnotation;
    
    const allAllowedVariables = { ...allowedBookVariables, annotations: [allowedAnnotationVariables], ...allowedAnnotationVariables };
    
    const customizationDocPath = path.join(process.cwd(), 'docs', 'customization', 'templates-and-variables.md');
    const customizationDocContent = await fs.readFile(customizationDocPath, 'utf-8');

    const templateVariablesSection = customizationDocContent.split('## Template variables')[1]?.split('## ')[0];
    const listedVariablesInDoc = templateVariablesSection.match(/- `\{{2,3}(\w+)\}{2,3}`/gm)!;
    
    expect(templateVariablesSection).toBeDefined();
    
    for (const listedVariable of listedVariablesInDoc) {
      const variableName = listedVariable.match(/- `\{{2,3}(\w+)\}{2,3}`/)?.[1];
      const isVariableInIBook = Object.keys(allAllowedVariables).includes(variableName!);
      
      expect(variableName).toBeDefined();
      expect(isVariableInIBook).toBeTruthy();
    }
  });
});
