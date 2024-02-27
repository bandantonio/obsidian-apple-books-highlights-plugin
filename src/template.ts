const defaultTemplate = `Title:: 📕 {{bookTitle}}
Author:: {{bookAuthor}}
Language:: {{bookLanguage}}
LastOpened:: {{bookLastOpened}}
Link:: [Apple Books Link](ibooks://assetid/{{bookId}})

![cover]({{bookCoverUrl}})

## Annotations

Number of annotations:: {{annotations.length}}

{{#each annotations}}
----

- 📖 Chapter:: {{#if chapter}}{{chapter}}{{else}}N/A{{/if}}
- 🔖 Context:: {{#if contextualText}}{{contextualText}}{{else}}N/A{{/if}}
- 🎯 Highlight:: {{highlight}}
- 📝 Note:: {{#if note}}{{note}}{{else}}N/A{{/if}}
- 📅 Date:: {{#if annotationDate}}{{annotationDate}}{{else}}N/A{{/if}}
- 🎨 Style:: {{annotationStyle}} 

{{/each}}
`;

export default defaultTemplate;