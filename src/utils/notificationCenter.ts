import { Notice } from 'obsidian';

export const showSuccessfulImportNotice = (): Notice => {
  return new Notice('Apple Books highlights imported successfully');
};

export const showFailedImportNotice = (pluginName: string): Notice => {
  return new Notice(`[${pluginName}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
};

export const showErrorInConsole = (pluginName: string, error: unknown): void => {
  console.error(`[${pluginName}]:`, error);
};
