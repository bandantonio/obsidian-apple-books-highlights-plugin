const renderedAnnotationThree = `- 📖 Chapter:: Aggregated Introduction 3
- 🔖 Context:: This is a contextual text for the third aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: third aggregated highlight from the Apple iPhone User Guide
- 📝 Note:: Test note for the third aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/24[ch3]!/4/2/10,/1:19,/3:113))`;

const renderedAnnotationOne = `- 📖 Chapter:: Aggregated Introduction 1
- 🔖 Context:: This is a contextual text for the first aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: first aggregated highlight from the Apple iPhone User Guide
- 📝 Note:: Test note for the first aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/12[ch1]!/4/2/10,/1:0,/:87))`;

const renderedAnnotationFour = `- 📖 Chapter:: Aggregated Introduction 4
- 🔖 Context:: This is a contextual text for the fourth aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: fourth aggregated highlight from the Apple iPhone User Guide
- 📝 Note:: Test note for the fourth aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/36[ch4]!/10/2/4,/1:0,/:96))`;

const renderedAnnotationTwo = `- 📖 Chapter:: Aggregated Introduction 2
- 🔖 Context:: This is a contextual text for the second aggregated highlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation
- 🎯 Highlight:: second aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
and another new line
to check one more time
- 📝 Note:: Test note for the second aggregated highlight from the Apple iPhone User Guide
along with a new line to test the preservation of indentation
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/18[ch2]!/4/2/10,/4/1:19,/3:113))`;

export const defaultTemplateMockWithAnnotationsSortedByDefault = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)

## Annotations

Number of annotations:: 4

----

${renderedAnnotationThree}

----

${renderedAnnotationTwo}

----

${renderedAnnotationFour}

----

${renderedAnnotationOne}

`;

const renderedColoredAnnotationThree = `- 📖 Chapter:: Aggregated Introduction 3
- 🔖 Context:: This is a contextual text for the third aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">third aggregated highlight from the Apple iPhone User Guide</mark>
- 📝 Note:: Test note for the third aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/24[ch3]!/4/2/10,/1:19,/3:113))
- <small>📅 Highlight taken on:: 2024-07-25 03:52:05 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-07-25 06:52:24 PM -04:00</small>`;

const renderedColoredAnnotationOne = `- 📖 Chapter:: Aggregated Introduction 1
- 🔖 Context:: This is a contextual text for the first aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">first aggregated highlight from the Apple iPhone User Guide</mark>
- 📝 Note:: Test note for the first aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/12[ch1]!/4/2/10,/1:0,/:87))
- <small>📅 Highlight taken on:: 2024-07-25 03:52:34 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-07-25 03:52:34 PM -04:00</small>`;

const renderedColoredAnnotationFour = `- 📖 Chapter:: Aggregated Introduction 4
- 🔖 Context:: This is a contextual text for the fourth aggregated highlight from the Apple iPhone User Guide
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">fourth aggregated highlight from the Apple iPhone User Guide</mark>
- 📝 Note:: Test note for the fourth aggregated highlight from the Apple iPhone User Guide
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/36[ch4]!/10/2/4,/1:0,/:96))
- <small>📅 Highlight taken on:: 2024-07-25 03:52:29 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-07-25 03:52:29 PM -04:00</small>`;

const renderedColoredAnnotationTwo = `- 📖 Chapter:: Aggregated Introduction 2
- 🔖 Context:: This is a contextual text for the second aggregated highlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation
- 🎯 Highlight:: <mark style="background:rgb(249,213,108); color:#000; padding:2px;">second aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
and another new line
to check one more time</mark>
- 📝 Note:: Test note for the second aggregated highlight from the Apple iPhone User Guide
along with a new line to test the preservation of indentation
- 📙 Highlight Link:: [Apple Books Highlight Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5#epubcfi(/6/18[ch2]!/4/2/10,/4/1:19,/3:113))
- <small>📅 Highlight taken on:: 2024-07-25 03:52:17 PM -04:00</small>
- <small>📅 Highlight modified on:: 2024-07-25 06:51:55 PM -04:00</small>`;

export const renderedCustomTemplateMockWithDefaultSorting = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Genre:: Technology
Language:: EN
Last Read:: 2024-07-25 03:52:34 PM -04:00
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)



## Annotations

Number of annotations:: 4

----

${renderedColoredAnnotationThree}

----

${renderedColoredAnnotationTwo}

----

${renderedColoredAnnotationFour}

----

${renderedColoredAnnotationOne}

`;

export const renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines = `Title:: 📕 Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title
Author:: Apple Inc.
Link:: [Apple Books Link](ibooks://assetid/THBFYNJKTGFTTVCGSAE5)

## Annotations

Number of annotations:: 4

----

> [!QUOTE]
>  third aggregated highlight from the Apple iPhone User Guide

----

> [!QUOTE]
>  second aggregated highlight from the Apple iPhone User Guide
containing a new line to test the preservation of indentation
and another new line
to check one more time

----

> [!QUOTE]
>  fourth aggregated highlight from the Apple iPhone User Guide

----

> [!QUOTE]
>  first aggregated highlight from the Apple iPhone User Guide

`;
