const defaultTemplate = `Title:: 📕 {{{bookTitle}}}
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

export default defaultTemplate;