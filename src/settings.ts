import { App, PluginSettingTab, Setting } from 'obsidian';
import IBookHighlightsPlugin from '../main';
import defaultTemplate from './template';
import { IBookHighlightsPluginSettings } from './types';

export const DEFAULT_SETTINGS: IBookHighlightsPluginSettings = {
    highlightsFolder: 'ibooks-highlights',
    backup: false,
    template: defaultTemplate,
}

class IBookHighlightsSettingTab extends PluginSettingTab {
    plugin: IBookHighlightsPlugin;

    constructor(app: App, plugin: IBookHighlightsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Highlights folder')
            .setDesc('A folder (within the root of your vault) where you want to save imported highlights')
            .addText(text => text
                .setPlaceholder('Folder to save highlights')
                .setValue(this.plugin.settings.highlightsFolder)
                .onChange(async (value) => {
                    this.plugin.settings.highlightsFolder = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Backup highlights')
            .setDesc('Backup highlights folder before import. Backup folder template: <highlights-folder>-bk-<timestamp> (For example, ibooks-highlights-bk-1704060001)')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.backup)
                    .onChange(async (value) => {
                        this.plugin.settings.backup = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Template')
            .setDesc('Template for highlight files')
            .setClass("ibooks-highlights-template")
            .addTextArea((text) => {
                text
                    .setPlaceholder('Template')
                    .setValue(this.plugin.settings.template)
                    .onChange(async (value) => {
                        let valueToSet = (value === '') ? defaultTemplate : value;
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

export { IBookHighlightsSettingTab }