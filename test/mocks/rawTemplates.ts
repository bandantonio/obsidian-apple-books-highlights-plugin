export const rawCustomTemplateMock = `Title:: 📕 {{{bookTitle}}}
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
- 📙 Highlight Link:: {{#if highlightLocation}}[Apple Books Highlight Link](ibooks://assetid/{{../bookId}}#{{highlightLocation}}){{else}}N/A{{/if}}
- <small>📅 Highlight taken on:: {{dateFormat highlightCreationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>
- <small>📅 Highlight modified on:: {{dateFormat highlightModificationDate "YYYY-MM-DD hh:mm:ss A Z"}}</small>

{{/each}}
`;
