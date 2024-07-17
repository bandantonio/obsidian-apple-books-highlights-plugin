export const defaultTemplateMock = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)

## Annotations

Number of annotations:: 2

----

- 📖 Chapter:: Aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: aggregated highlight from the Apple iPhone User Guide
- 📝 Note:: Test note for the aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#aggregated-highlight-link-from-the-apple-iphone-user-guide)

----

- 📖 Chapter:: Another aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
- 🎯 Highlight:: aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
- 📝 Note:: Test note for the aggregated highlight from the Apple iPhone User Guide
along with a new line to test the preservation of indentation
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#aggregated-highlight-link-from-the-apple-iphone-user-guide)

`;

export const renderedCustomTemplateMock = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Genre:: Technology
Language:: EN
Last Read:: 2024-03-11 03:04:53 PM -04:00
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)



## Annotations

Number of annotations:: 2

----

- 📖 Chapter:: Aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">aggregated highlight from the Apple iPhone User Guide</mark>
- 📝 Note:: Test note for the aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#aggregated-highlight-link-from-the-apple-iphone-user-guide)
- <small>📅 Highlight taken on:: 2024-03-11 03:04:53 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-03-11 03:04:53 PM -04:00</small>

----

- 📖 Chapter:: Another aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation</mark>
- 📝 Note:: Test note for the aggregated highlight from the Apple iPhone User Guide
along with a new line to test the preservation of indentation
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#aggregated-highlight-link-from-the-apple-iphone-user-guide)
- <small>📅 Highlight taken on:: 2024-03-11 03:04:53 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-03-11 03:04:53 PM -04:00</small>

`;

export const renderedCustomTemplateWrappedTextBlockMock = `Title:: 📕 Designing Data-Intensive Applications
Author:: Kleppmann, Martin
Link:: [Apple Books Link](ibooks://assetid/28AEDF62F12B289C88BD6659BD6E50CC)

## Annotations

Number of annotations:: 1

----

> [!QUOTE]
>  Chapter 1 introduces the terminology and approach
that we're going to use throughout this book. It examines what we actually mean by
words like reliability, scalability, and maintainability, and how
we can try to achieve these goals.

`;
