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

## Highlights sorting criterion

- Default value: By creation date (from oldest to newest)

Sort highlight by a specific criterion.

The available options are:

- By creation date (from oldest to newest)
- By creation date (from newest to oldest)
- By last modification date* (from oldest to newest)
- By last modification date* (from newest to oldest)
- By location in a book

::: tip What a modification is?
Modification includes the following cases:

- Updating highlight text
- Adding or updating a note
- Changing the highlight color or style
:::

::: details Examples

Let's consider an example book with the following highlights (callouts to the left indicate the order in which the highlights were created):

![Highlights order](../assets/example-highlights-order.png)

- **By creation date (from oldest to newest)**: The highlights that were created first will be at the top.

	::: details Example
	```md
	## Annotations
	----
	- 🎯 Highlight:: And now this. Christmas Day, alone on a hospital ward, failing to get through my shift.
	----
	- 🎯 Highlight:: At 10:30am, I looked around the ward. Nurse Janice was sprinting up and down corridor A
	----
	- 🎯 Highlight:: As Christmas turned to Boxing Day, I stayed up poring over my old notes and wondered whether that was where I was going wrong
	----
	- 🎯 Highlight:: ‘Merry Christmas, Ali. Try not to kill anyone.’
	```
	:::

- **By creation date (from newest to oldest)**: The highlights that were created last will be at the top.

	::: details Example
	```md
	## Annotations
	----
	- 🎯 Highlight:: ‘Merry Christmas, Ali. Try not to kill anyone.’
	----
	- 🎯 Highlight:: As Christmas turned to Boxing Day, I stayed up poring over my old notes and wondered whether that was where I was going wrong
	----
	- 🎯 Highlight:: At 10:30am, I looked around the ward. Nurse Janice was sprinting up and down corridor A
	----
	- 🎯 Highlight:: And now this. Christmas Day, alone on a hospital ward, failing to get through my shift.
	```
	:::

- **By last modification date (from oldest to newest)**: The highlights that were modified first will be at the top.

	::: details Example
	```md
	## Annotations
	----
	- 🎯 Highlight:: As Christmas turned to Boxing Day, I stayed up poring over my old notes and wondered whether that was where I was going wrong
	- 📝 Note:: N/A
	----
	- 🎯 Highlight:: ‘Merry Christmas, Ali. Try not to kill anyone.’
	- 📝 Note:: N/A
	----
	- 🎯 Highlight:: At 10:30am, I looked around the ward. Nurse Janice was sprinting up and down corridor A
	- 📝 Note:: Test modification date (modified first)
	----
	- 🎯 Highlight:: And now this. Christmas Day, alone on a hospital ward, failing to get through my shift.
	- 📝 Note:: Test modification date (modified second)
	```
	:::

- **By last modification date (from newest to oldest)**: The highlights that were modified last will be at the top.

	::: details Example
	```md
	## Annotations
	----
	- 🎯 Highlight:: And now this. Christmas Day, alone on a hospital ward, failing to get through my shift.
	- 📝 Note:: Test modification date (modified second)
	----
	- 🎯 Highlight:: At 10:30am, I looked around the ward. Nurse Janice was sprinting up and down corridor A
	- 📝 Note:: Test modification date (modified first)
	----
	- 🎯 Highlight:: ‘Merry Christmas, Ali. Try not to kill anyone.’
	- 📝 Note:: N/A
	----
	- 🎯 Highlight:: As Christmas turned to Boxing Day, I stayed up poring over my old notes and wondered whether that was where I was going wrong
	- 📝 Note:: N/A
	```
	:::

- **By location in a book**: Highlights are sorted by their location in a book.

	::: details Example
	```md
	## Annotations
	----
	- 🎯 Highlight:: ‘Merry Christmas, Ali. Try not to kill anyone.’
	- 📝 Note:: N/A
	----
	- 🎯 Highlight:: At 10:30am, I looked around the ward. Nurse Janice was sprinting up and down corridor A
	- 📝 Note:: Test modification date (modified first)
	----
	- 🎯 Highlight:: And now this. Christmas Day, alone on a hospital ward, failing to get through my shift.
	- 📝 Note:: Test modification date (modified second)
	----
	- 🎯 Highlight:: As Christmas turned to Boxing Day, I stayed up poring over my old notes and wondered whether that was where I was going wrong
	- 📝 Note:: N/A
	```
	:::
:::

## Template

- Template for highlight files.

Check the [Templates and variables](/customization/templates-and-variables) page for more information.

## Reset template

- Reset template to default

A quick way to reset the template to the [default one](/customization/templates-and-variables#default-template). May be useful if you've made a mistake or any unwanted changes to the template and want to start over.
