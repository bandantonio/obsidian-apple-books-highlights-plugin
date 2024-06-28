import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import IBookHighlightsPlugin from '../main';
import defaultTemplate from './template';

export class AppleBooksHighlightsImportPluginSettings {
	highlightsFolder = 'ibooks-highlights';
	backup = false;
	importOnStart = false;
	template = defaultTemplate;
}

export class IBookHighlightsSettingTab extends PluginSettingTab {
    plugin: IBookHighlightsPlugin;

    constructor(app: App, plugin: IBookHighlightsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        const folder = new Setting(containerEl)
            .setName('Highlights folder')
            .setDesc('A folder (within the root of your vault) where you want to save imported highlights')
			.setClass('ibooks-highlights-folder')

		folder.addText(text => text
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
			}));

        new Setting(containerEl)
            .setName('Import highlights on start')
            .setDesc('Import all hightlights from all your books when Obsidian starts')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.importOnStart)
                    .onChange(async (value) => {
                        this.plugin.settings.importOnStart = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Backup highlights')
            .setDesc('Backup highlights folder before import. Backup folder template: <highlights-folder>-bk-<timestamp> (For example, ibooks-highlights-bk-1704060001)')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.backup)
                    .onChange(async (value) => {
                        if (!value) {
                            new Notice('Disabling backups imposes a risk of data loss. Please use with caution.', 0);
                        }
                        this.plugin.settings.backup = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Template')
            .setDesc('Template for highlight files')
            .setClass('ibooks-highlights-template')
            .addTextArea((text) => {
                text
                    .setPlaceholder('Template')
                    .setValue(this.plugin.settings.template)
                    .onChange(async (value) => {
                        const valueToSet = (value === '') ? defaultTemplate : value;
                        this.plugin.settings.template = valueToSet;
                        await this.plugin.saveSettings();
                    });
                return text;
            });

        new Setting(containerEl)
            .setName('Reset template')
            .setDesc('Reset template to default')
            .addButton((button) => {
                button.setButtonText('Reset template')
                    .onClick(async () => {
                        this.plugin.settings.template = defaultTemplate;
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });

        containerEl.createEl('hr');
        containerEl
            .createEl('small', { text: 'Created by ', cls: 'credits' })
            .createEl('a', {
                text: 'bandantonio',
                href: 'https://github.com/bandantonio',
            })
    }
}

