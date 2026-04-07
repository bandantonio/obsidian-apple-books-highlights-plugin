import type IBookHighlightsPlugin from '../../main';
import type { IBookHighlightsPluginSettings } from '../types';
import { importHighlights } from '../importHighlights';
import { OverwriteBookModal } from '../modals/overwriteConsent';
import { showSuccessfulImportNotice, showFailedImportNotice, showErrorInConsole } from './notificationCenter';

export const backupAndImport = async (plugin: IBookHighlightsPlugin, settings: IBookHighlightsPluginSettings, importMode?: 'modify') => {
  if (settings.backup) {
    try {
      await plugin.vault.backupAllHighlights();
      await importHighlights(plugin.vault, settings, importMode);
      showSuccessfulImportNotice();
    } catch (error: any) {
      showFailedImportNotice(plugin.manifest.name);
      showErrorInConsole(plugin.manifest.name, error);
    }
  } else {
    new OverwriteBookModal(plugin.app, plugin).open();
  }
};
