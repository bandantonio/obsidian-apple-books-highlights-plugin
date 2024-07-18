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
and another new line
to check one more time
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
containing a new line to test the preservation of indentation
and another new line
to check one more time</mark>
- 📝 Note:: Test note for the aggregated highlight from the Apple iPhone User Guide
along with a new line to test the preservation of indentation
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#aggregated-highlight-link-from-the-apple-iphone-user-guide)
- <small>📅 Highlight taken on:: 2024-03-11 03:04:53 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-03-11 03:04:53 PM -04:00</small>

`;

export const renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)

## Annotations

Number of annotations:: 2

----

> [!QUOTE]
>  aggregated highlight from the Apple iPhone User Guide

----

> [!QUOTE]
>  aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
and another new line
to check one more time

`;
