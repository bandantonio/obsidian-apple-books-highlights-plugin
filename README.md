# Obsidian Apple Books highlights import plugin

Import all your Apple Books highlights to Obsidian.

![GitHub Downloads](https://img.shields.io/github/downloads/bandantonio/obsidian-apple-books-highlights-plugin/total?style=for-the-badge&logo=github&color=573e7a)


## Overview

This plugin aims to be a **fast**, **customizable**, **reliable**, and **up-to-date** solution to import your Apple Books highlights to Obsidian:

- **Fast**: It takes less than 1 second to import ~1000 highlights.
- **Customizable**: Use Handlebars and Markdown to customize the output of your highlights the way you want. All the variables to use are available in the default template. Check the `Template variables` section below for more information.

- **Reliable**:
  - Import actual highlights with only the metadata you need. No visual noise with the deleted but still exported highlights, or, on the contrary, highlights and notes that make no sense without the context.
  - Back up your highlights before each import to avoid accidental data loss (optional, but recommended).
- **Dataview-ready**: The default template creates highlights in a format that is compatible with [Dataview](https://blacksmithgu.github.io/obsidian-dataview/), so you can use your highlights in Dataview queries to unleash possible use cases even further (for example, to create a list of books you've read).
- **Up-to-date**: The plugin is updated regularly to support the latest versions of Obsidian, and Apple Books, as well as react to the users' feedback.

## Preview of imported highlights

![Preview](preview.png)

## How to install

1. Open **Settings**.
1. Select **Turn on community plugins**
1. Select **Browse** to list all available community plugins.
1. Search for **Apple Books - Import Highlights**.
1. Select **Install**.
1. Select **Enable** right after installation

Check Obsidian Help for more information about [Community plugins](https://help.obsidian.md/Extending+Obsidian/Community+plugins)

## How to use

- **Command palette**:
  - `Cmd+P > Apple Books - Import Highlights: Import all`
  - `Cmd+P > Apple Books - Import Highlights: From a specific book...`
- **Ribbon**: Select the plugin icon in the Ribbon (left sidebar)

## Template variables

- `{{{bookTitle}}}` - The title of the book.
- `{{bookId}}` - A unique identifier of the book. It is used to create a link to the book in Apple Books: `[Apple Books Link](ibooks://assetid/{{bookId}})`.
- `{{{bookAuthor}}}` - The author of the book.
- `{{annotations}}` - An array of all the annotations in the book. You can use `{{annotations.length}}` to get the total number of annotations you made in the book. Each annotation has the following properties:
  - `{{{chapter}}}` - The chapter of the highlight in the book. It may not be available for all highlights due to the initial formatting of the book.
  - `{{{contextualText}}}` - The text surrounding the highlight to give you more context. For example:
    - If you highlight a part of a sentence, the - `contextualText` will contain the whole sentence.
    - If you highlight parts of two adjacent sentences, the `contextualText` will contain both sentences.
  - `{{{highlight}}}` - The highlighted text.
  - `{{{note}}}` - A note you added for the highlight.

> [!NOTE]
> When customizing the template, make sure to wrap variables with triple curly braces (`{{{variable}}}`) to avoid escaping the HTML characters in Markdown files (default behavior).
>
> If you want escaped output, use double curly braces: `{{variable}}`.

## Contributing

Your feedback and ideas are more than welcome and highly appreciated! Join the discussion in the [Obsidian Forum](https://forum.obsidian.md/t/new-plugin-apple-books-import-highlights/76856).

If you have any question, feedback, or issue, feel free to open an issue. 
