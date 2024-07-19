# Settings

## Highlight folder

- Default value: `ibooks-highlights`

A folder (within the root of your vault) where you want to save imported highlights. You can use digits, dashes, underscores, or spaces in the folder name. To specify a subfolder of any depth, use `/` as a separator. If the specified path does not exist (fully or partially), it will be created.

For example, below are some valid folder names:

- `notes/highlights`
- `imported_notes/apple_books/highlights`
- `3 - Resources/My Books/Apple Books/Unprocessed`

If the highlight folder is not empty and the [Backup highlights](#backup-highlights) setting is enabled, the plugin will save the existing highlights to a backup folder before importing new highlights. If the setting is disabled, the plugin will overwrite the contents of the highlight folder.


## Import highlights on start

- Default value: Turned off

Import all highlights from all your books when Obsidian starts. Respects the [Backup highlights](#backup-highlights) setting.

## Backup highlights

- Default value: Turned off
- Backup folder template: `<highlights-folder>-bk-<timestamp>`. For example, `ibooks-highlights-bk-1704060001`.

Backup highlights folder before import. The backup folder name is pre-configured based on the template above and cannot be changed. The backup is created inside the [highlight folder](#highlight-folder).

> [!WARNING]
> If the setting is disabled, the plugin will overwrite the contents of the [highlight folder](#highlight-folder) on import.
> This behavior will be improved based on the feedback received: [Issue #34](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/issues/34#issuecomment-2231429171)

## Template

- Template for highlight files.

Check the [Templates and variables](/customization/templates-and-variables) page for more information.

## Reset template

- Reset template to default

A quick way to reset the template to the [default one](/customization/templates-and-variables#default-template). May be useful if you've made a mistake or any unwanted changes to the template and want to start over.
