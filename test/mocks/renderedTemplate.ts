export const defaultTemplateMock = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)

## Annotations

Number of annotations:: 2

----

- 📖 Chapter:: Aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide
- 🎯 Highlight:: aggregated hightlight from the Apple iPhone User Guide
- 📝 Note:: Test note for the aggregated hightlight from the Apple iPhone User Guide

----

- 📖 Chapter:: Another aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide<br>
containing a new line to test the preservation of indentation
- 🎯 Highlight:: aggregated hightlight from the Apple iPhone User Guide<br>
containing a new line to test the preservation of indentation
- 📝 Note:: Test note for the aggregated hightlight from the Apple iPhone User Guide<br>
along with a new line to test the preservation of indentation

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
- 🔖 Context:: This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">aggregated hightlight from the Apple iPhone User Guide</mark>
- 📝 Note:: Test note for the aggregated hightlight from the Apple iPhone User Guide
- <small>📅 Highlight taken on:: 2024-03-11 03:04:53 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-03-11 03:04:53 PM -04:00</small>

----

- 📖 Chapter:: Another aggregated Introduction
- 🔖 Context:: This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide<br>
containing a new line to test the preservation of indentation
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">aggregated hightlight from the Apple iPhone User Guide<br>
containing a new line to test the preservation of indentation</mark>
- 📝 Note:: Test note for the aggregated hightlight from the Apple iPhone User Guide<br>
along with a new line to test the preservation of indentation
- <small>📅 Highlight taken on:: 2024-03-11 03:04:53 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-03-11 03:04:53 PM -04:00</small>

`;
