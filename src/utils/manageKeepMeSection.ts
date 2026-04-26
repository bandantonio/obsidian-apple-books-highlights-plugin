import { Plugin, TFile } from 'obsidian';
import type { IBookHighlightsPluginSettings } from '../types';

function escapeKeepMeSectionDelimiters(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const extractKeepMeSectionFromContent = (content: string, settings: IBookHighlightsPluginSettings): string | null => {
  const startDelimiter = escapeKeepMeSectionDelimiters(settings.keepMeSectionOpeningDelimiter);
  const endDelimiter = escapeKeepMeSectionDelimiters(settings.keepMeSectionClosingDelimiter);

  const keepMeSectionRegex = new RegExp(`${startDelimiter}\\n*([\\s\\S]*?)\\n*${endDelimiter}`);

  const keepMeSectionDataMatch = content.match(keepMeSectionRegex);
  return keepMeSectionDataMatch ? keepMeSectionDataMatch[1].replace(/^\n+|\n+$/g, '') : null;
};

export const saveKeepMeSectionData = async (file: TFile, data: string, plugin: Plugin, settings: IBookHighlightsPluginSettings) => {
  const isBackupFile = /-bk-\d{3,15}/i.test(file.basename);
  const isInHighlightsFolder = file.parent?.path === settings.highlightsFolder;

  if (isInHighlightsFolder && !isBackupFile) {
    const keepMeSectionData = extractKeepMeSectionFromContent(data, settings);

    if (keepMeSectionData) {
      // Matched and has content: save it
      settings.keepMeSectionData = settings.keepMeSectionData || {};
      settings.keepMeSectionData[file.basename] = keepMeSectionData;
      await plugin.saveData(settings);
    } else if (keepMeSectionData !== null && settings.keepMeSectionData && settings.keepMeSectionData[file.basename]) {
      // Matched but empty: delete the entry (user explicitly cleared the section)
      delete settings.keepMeSectionData[file.basename];
      await plugin.saveData(settings);
    }
    // If keepMeSectionData === null (delimiters not found), do nothing to preserve existing data
  }
};

export const getKeepMeSectionDataFromSettings = (filename: string, settings: IBookHighlightsPluginSettings) => {
  if (settings.keepMeSectionData && settings.keepMeSectionData[filename]) {
    return settings.keepMeSectionData[filename];
  }
  return '';
};

export const embedKeepMeSectionDataIntoBookFile = (keepMeSectionData: string, content: string, settings: IBookHighlightsPluginSettings) => {
  const keepMeSection = `${settings.keepMeSectionOpeningDelimiter}\n${keepMeSectionData}\n${settings.keepMeSectionClosingDelimiter}`;
  const startDelimiter = escapeKeepMeSectionDelimiters(settings.keepMeSectionOpeningDelimiter);
  const endDelimiter = escapeKeepMeSectionDelimiters(settings.keepMeSectionClosingDelimiter);

  return content.replace(new RegExp(`${startDelimiter}\\n*([\\s\\S]*?)\\n*${endDelimiter}`), () => keepMeSection);
};
