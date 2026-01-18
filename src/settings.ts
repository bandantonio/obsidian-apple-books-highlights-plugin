import { type App, Notice, PluginSettingTab, Setting } from 'obsidian';
import type IBookHighlightsPlugin from '../main';
import { type IBookHighlightsPluginSettings, IHighlightsSortingCriterion } from './types';

export const defaultTemplate = `Title:: 📕 {{{bookTitle}}}
Author:: {{{bookAuthor}}}
Link:: [Apple Books Link](ibooks://assetid/{{bookId}})

## Annotations

Number of annotations:: {{annotations.length}}

{{#each annotations}}
----

- 📖 Chapter:: {{#if chapter}}{{{chapter}}}{{else}}N/A{{/if}}
- 🔖 Context:: {{#if contextualText}}{{{contextualText}}}{{else}}N/A{{/if}}
- 🎯 Highlight:: {{{highlight}}}
- 📝 Note:: {{#if note}}{{{note}}}{{else}}N/A{{/if}}
- 📙 Highlight Link:: {{#if highlightLocation}}[Apple Books Highlight Link](ibooks://assetid/{{../bookId}}#{{highlightLocation}}){{else}}N/A{{/if}}

{{/each}}
`;

export const allowedFilenameTemplateVariables = [
  // The first variable is the default one
  'bookTitle',
  'bookId',
  'bookAuthor',
  'bookGenre',
  'bookLanguage',
];

export const getDefaultFilenameTemplate = (): string => `{{{${allowedFilenameTemplateVariables[0]}}}}`;

export const defaultPluginSettings: IBookHighlightsPluginSettings = {
  highlightsFolder: 'ibooks-highlights',
  backup: false,
  importOnStart: false,
  highlightsSortingCriterion: IHighlightsSortingCriterion.CreationDateOldToNew,
  template: defaultTemplate,
  filenameTemplate: getDefaultFilenameTemplate(),
};

export class IBookHighlightsSettingTab extends PluginSettingTab {
  plugin: IBookHighlightsPlugin;
  settings: IBookHighlightsPluginSettings;

  constructor(app: App, plugin: IBookHighlightsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.settings = plugin.settings;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addHighlightsFolderSetting(containerEl);
    this.addImportOnStartSetting(containerEl);
    this.addBackupSetting(containerEl);
    this.addHighlightsSortingCriterionSetting(containerEl);
    this.addTemplateSetting(containerEl);
    this.addFilenameTemplateSetting(containerEl);
    this.addResetTemplateSetting(containerEl);
    this.addCredits(containerEl);
  }

  private addHighlightsFolderSetting(containerEl: HTMLElement): void {
    const folder = new Setting(containerEl)
      .setName('Highlights folder')
      .setDesc('A folder (within the root of your vault) where you want to save imported highlights')
      .setClass('ibooks-highlights-folder');

    folder.addText((text) =>
      text
        .setPlaceholder('Folder to save highlights')
        .setValue(this.plugin.settings.highlightsFolder)
        .onChange(async (value) => {
          if (!value) {
            folder.controlEl.addClass('setting-error');
            return;
          }

          folder.controlEl.removeClass('setting-error');
          this.plugin.settings.highlightsFolder = value;

          await this.plugin.saveSettings();
        }),
    );
  }

  private addImportOnStartSetting(containerEl: HTMLElement): void {
    new Setting(containerEl)
      .setName('Import highlights on start')
      .setDesc('Import all highlights from all your books when Obsidian starts')
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.importOnStart).onChange(async (value) => {
          this.plugin.settings.importOnStart = value;

          await this.plugin.saveSettings();
        });
      });
  }

  private addBackupSetting(containerEl: HTMLElement): void {
    new Setting(containerEl)
      .setName('Backup highlights')
      .setDesc(
        createFragment((el) => {
          el.appendText('Backup highlights before import.');
          el.createEl('br');
          el.appendText('- Folder template: <highlights-folder>-bk-<timestamp> (For example, ibooks-highlights-bk-1704060001).');
          el.createEl('br');
          el.appendText('- File template: <highlights-file>-bk-<timestamp> (For example, Building a Second Brain-bk-1704060001).');
        }),
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.backup).onChange(async (value) => {
          if (!value) {
            new Notice('Disabling backups imposes a risk of data loss. Please use with caution.', 0);
          }
          this.plugin.settings.backup = value;

          await this.plugin.saveSettings();
        });
      });
  }

  private addHighlightsSortingCriterionSetting(containerEl: HTMLElement): void {
    new Setting(containerEl)
      .setName('Highlights sorting criterion')
      .setDesc('Sort highlights by a specific criterion. Default: By creation date (from oldest to newest)')
      .setClass('ibooks-highlights-sorting')
      .addDropdown((dropdown) => {
        const options = {
          [IHighlightsSortingCriterion.CreationDateOldToNew]: 'By creation date (from oldest to newest)',
          [IHighlightsSortingCriterion.CreationDateNewToOld]: 'By creation date (from newest to oldest)',
          [IHighlightsSortingCriterion.LastModifiedDateOldToNew]: 'By modification date (from oldest to newest)',
          [IHighlightsSortingCriterion.LastModifiedDateNewToOld]: 'By modification date (from newest to oldest)',
          [IHighlightsSortingCriterion.Book]: 'By location in a book',
        };

        dropdown
          .addOptions(options)
          .setValue(this.plugin.settings.highlightsSortingCriterion)
          .onChange(async (value: IHighlightsSortingCriterion) => {
            this.plugin.settings.highlightsSortingCriterion = value;

            await this.plugin.saveSettings();
          });
      });
  }

  private addTemplateSetting(containerEl: HTMLElement): void {
    new Setting(containerEl)
      .setName('Template')
      .setDesc('Template for highlight files')
      .setClass('ibooks-highlights-template')
      .addTextArea((text) => {
        text
          .setPlaceholder('Template')
          .setValue(this.plugin.settings.template)
          .onChange(async (value) => {
            const valueToSet = value === '' ? defaultTemplate : value;
            this.plugin.settings.template = valueToSet;

            await this.plugin.saveSettings();
          });
        return text;
      });
  }

  private addFilenameTemplateSetting(containerEl: HTMLElement): void {
    const filenameTemplate = new Setting(containerEl)
      .setName('Template for naming highlight files')
      .setDesc(
        createFragment((el) => {
          el.appendText('Template to generate the name of highlight files.');
          el.createEl('br');
          el.appendText('The following template variables are available:');

          const ul = el.createEl('ul');
          for (const variable of allowedFilenameTemplateVariables) {
            ul.createEl('li', {
              text: `{{{${variable}}}}`,
            });
          }
          el.createEl('br');
          // The first variable is the default one
          el.appendText(`Default: {{{${allowedFilenameTemplateVariables[0]}}}}`);
        }),
      )
      .setClass('ibooks-highlights-file-naming-template');

    filenameTemplate.addTextArea((text) => {
      text
        .setPlaceholder('Naming template for highlight files')
        .setValue(this.plugin.settings.filenameTemplate)
        .onChange(async (value) => {
          const valueToSet = value === '' ? '{{{bookTitle}}}' : value;
          this.plugin.settings.filenameTemplate = valueToSet;

          await this.plugin.saveSettings();
        });
      return text;
    });
  }

  private addResetTemplateSetting(containerEl: HTMLElement): void {
    new Setting(containerEl)
      .setName('Reset template')
      .setDesc('Reset template to default')
      .addButton((button) => {
        button.setButtonText('Reset template').onClick(async () => {
          this.plugin.settings.template = defaultTemplate;

          await this.plugin.saveSettings();
          this.display();
        });
      });
  }

  private addCredits(containerEl: HTMLElement): void {
    containerEl.createEl('hr');
    containerEl
      .createEl('small', {
        text: 'Created by ',
        cls: 'credits',
      })
      .createEl('a', {
        text: 'bandantonio',
        href: 'https://github.com/bandantonio',
      });
  }
}
