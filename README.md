# Obsidian Apple Books highlights import plugin

Import all your Apple Books highlights to Obsidian.

![Plugin banner](plugin-banner.png)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/bandantonio/obsidian-apple-books-highlights-plugin/release.yml?branch=master&style=for-the-badge&logo=github)
![GitHub manifest version](https://img.shields.io/github/manifest-json/v/bandantonio/obsidian-apple-books-highlights-plugin?style=for-the-badge&logo=obsidian&color=%230082FC)
![GitHub Downloads](https://img.shields.io/github/downloads/bandantonio/obsidian-apple-books-highlights-plugin/total?style=for-the-badge&logo=github&color=%237C3AED)
[![Coveralls](https://img.shields.io/coverallsCoverage/github/bandantonio/obsidian-apple-books-highlights-plugin?branch=master&style=for-the-badge&logo=coveralls&label=Test%20coverage&color=%233F5767)](https://coveralls.io/github/bandantonio/obsidian-apple-books-highlights-plugin?branch=master)

[![GitHub Discussions](https://img.shields.io/badge/github_discussions-blue?style=for-the-badge&color=%23373e47&logo=github)](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/discussions)
[![Plugin's page on Obsidian forum](https://img.shields.io/badge/obsidian_forum-blue?style=for-the-badge&color=%237C3AED&logo=obsidian)](https://forum.obsidian.md/t/new-plugin-apple-books-import-highlights/76856/21)

## Overview

This plugin aims to be a **fast**, **customizable**, **reliable**, and **up-to-date** solution to import your Apple Books highlights to Obsidian:

- **Fast**: It takes less than 1 second to import ~1000 highlights.
- **Customizable**: Use Handlebars and Markdown to customize the output of your highlights the way you want. Check the [`Template variables`](#template-variables) section below for more information.

- **Reliable**:
  - Import actual highlights with only the metadata you need. No visual noise with the deleted but still exported highlights, or, on the contrary, highlights and notes that make no sense without the context.
  - Back up your highlights before each import to avoid accidental data loss (optional, but recommended).
- **Dataview-ready**: The default template creates highlights in a format that is compatible with [Dataview](https://blacksmithgu.github.io/obsidian-dataview/), so you can use your highlights in Dataview queries to unleash possible use cases even further (for example, to create a list of books you've read).
- **Up-to-date**: The plugin is updated regularly to support the latest versions of Obsidian, and Apple Books, as well as react to the users' feedback.

## Preview of imported highlights

![Preview](preview.png)

## How to install

### Outside of Obsidian

1. Click the [link](https://obsidian.md/plugins?id=apple-books-import-highlights) (the same link you see in the "About" section of this repository) that will redirect you to the plugin's page on the Obsidian site.
1. Confirm the browser prompt to allow the website to open Obsidian.
1. In the Obsidian app:
	1. Click **Install** on the plugin's page.
	1. Click **Enable** right after installation.

### Inside Obsidian

1. Open **Settings**.
1. Click **Turn on community plugins**
1. Click **Browse** to list all available community plugins.
1. Search for **Apple Books - Import Highlights**.
1. Click **Install**.
1. Click **Enable** right after installation

Check Obsidian Help for more information about [Community plugins](https://help.obsidian.md/Extending+Obsidian/Community+plugins)

## How to use

- **Command palette**:
  - `Cmd+P > Apple Books - Import Highlights: Import all`
  - `Cmd+P > Apple Books - Import Highlights: From a specific book...`
- **Ribbon**: Click the plugin icon ![plugin-icon][icon-data-url] in the Ribbon (left sidebar)

## Customization

The plugin uses Handlebars and Markdown to customize the output of your highlights the way you want.

### Template variables

- `{{{bookTitle}}}` - The title of the book.
- `{{bookId}}` - A unique identifier of the book. It is used to create a link to the book in Apple Books: `[Apple Books Link](ibooks://assetid/{{bookId}})`.
- `{{{bookAuthor}}}` - The author of the book.
- `{{{bookGenre}}}` - The genre of the book.
- `{{bookLanguage}}` - The language of the book.
- `{{bookLastOpenedDate}}` - The date when you last opened the book. See the [Date formatting](#date-formatting) section for more information.
- `{{bookCoverUrl}}` - The URL of the book cover.
- `{{annotations}}` - An array of all the annotations in the book. You can use `{{annotations.length}}` to get the total number of annotations you made in the book. Each annotation has the following properties:
  - `{{{chapter}}}` - The chapter of the highlight in the book. It may not be available for all highlights due to the initial formatting of the book.
  - `{{{contextualText}}}` - The text surrounding the highlight to give you more context. For example:
    - If you highlight a part of a sentence, the - `contextualText` will contain the whole sentence.
    - If you highlight parts of two adjacent sentences, the `contextualText` will contain both sentences.
  - `{{{highlight}}}` - The highlighted text.
  - `{{{note}}}` - A note you added for the highlight.
  - `{{{highlightLocation}}}` - A unique identifier of the highlighted text. It is used to create a link to the highlighted text in Apple Books. For example: `[Apple Books Highlight Link](ibooks://assetid/{{bookId}}#{{highlightLocation}})`.
  - `{{highlightStyle}}` - The style of the highlight. It can be one of the following values:
    - `0` (underline)
    - `1` (green)
    - `2` (blue)
    - `3` (yellow)
    - `4` (pink)
    - `5` (violet)
  - `{{highlightCreationDate}}` - The date when you created the highlight. See the [Date formatting](#date-formatting) section for more information.
  - `{{highlightModificationDate}}` - The date when you last modified the highlight. See the [Date formatting](#date-formatting) section for more information.


> [!NOTE]
> When customizing the template, make sure to wrap variables with triple curly braces (`{{{variable}}}`) to avoid escaping the HTML characters in Markdown files (default behavior).
>
> If you want escaped output, use double curly braces: `{{variable}}`.

### Date formatting

The plugin uses the `dateFormat` helper that takes a unix timestamp and the [datajs-compatible string of tokens](https://day.js.org/docs/en/display/format#list-of-all-available-formats) to format dates in the template. For example:

```hbs
// Template
{{dateFormat dateVariable "date format"}}

// Example
{{dateFormat bookLastOpenedDate "YYYY-MM-DD hh:mm:ss A Z"}}
// Result
2024-03-04 05:50:28 PM +01:00

// Example
{{dateFormat bookLastOpenedDate "ddd, MMM DD YYYY, HH:mm:ss Z"}}
Mon, Mar 04 2024, 17:50:28 +02:00
```

### Templates

> [!TIP]
> If you created a template you love and want to share it with others, you're welcome to do it in the [corresponding topic](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/discussions/32). Your contribution will also help others to get inspired and create their own templates.

#### Template with colored highlights

![template colors](template-colors.png)

```hbs
Title:: 📕 {{{bookTitle}}}
Author:: {{{bookAuthor}}}
Genre:: {{#if bookGenre}}{{{bookGenre}}}{{else}}N/A{{/if}}
Language:: {{#if bookLanguage}}{{bookLanguage}}{{else}}N/A{{/if}}
Last Read:: {{dateFormat bookLastOpenedDate "YYYY-MM-DD hh:mm:ss A Z"}}
Link:: [Apple Books Link](ibooks://assetid/{{bookId}})

{{#if bookCoverUrl}}![Book Cover]({{{bookCoverUrl}}}){{/if}}

## Annotations

Number of annotations:: {{annotations.length}}

{{#each annotations}}
----

- 📖 Chapter:: {{#if chapter}}{{{chapter}}}{{else}}N/A{{/if}}
- 🔖 Context:: {{#if contextualText}}{{{contextualText}}}{{else}}N/A{{/if}}
{{#if (eq highlightStyle "0")}}- 🎯 Highlight:: <u>{{{highlight}}}</u>
{{else if (eq highlightStyle "1")}}- 🎯 Highlight:: <mark style="background:rgb(175,213,151); color:#000; padding:2px;">{{{highlight}}}</mark>
{{else if (eq highlightStyle "2")}}- 🎯 Highlight:: <mark style="background:rgb(181,205,238); color:#000; padding:2px;">{{{highlight}}}</mark>
{{else if (eq highlightStyle "3")}}- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">{{{highlight}}}</mark>
{{else if (eq highlightStyle "4")}}- 🎯 Highlight:: <mark style="background:rgb(242,178,188); color:#000; padding:2px;">{{{highlight}}}</mark>
{{else if (eq highlightStyle "5")}}- 🎯 Highlight:: <mark style="background:rgb(214,192,238); color:#000; padding:2px;">{{{highlight}}}</mark>
{{/if}}
- 📝 Note:: {{#if note}}{{{note}}}{{else}}N/A{{/if}}
- <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>
- <small>📅 Highlight modified on:: {{dateFormat highlightModificationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>

{{/each}}
```


## Contributing

Ready to contribute? Check the [Contributing guidelines](CONTRIBUTING.md) to get started.

Your feedback and ideas are more than welcome and highly appreciated! Join the discussion in:
- [Obsidian Forum](https://forum.obsidian.md/t/new-plugin-apple-books-import-highlights/76856)
- [GitHub Discussions](https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/discussions)

[icon-data-url]: data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5MTkxOTEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib29rLW9wZW4iPjxwYXRoIGQ9Ik0yIDNoNmE0IDQgMCAwIDEgNCA0djE0YTMgMyAwIDAgMC0zLTNIMnoiLz48cGF0aCBkPSJNMjIgM2gtNmE0IDQgMCAwIDAtNCA0djE0YTMgMyAwIDAgMSAzLTNoN3oiLz48L3N2Zz4=
