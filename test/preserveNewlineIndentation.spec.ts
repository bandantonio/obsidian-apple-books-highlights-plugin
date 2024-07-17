import { describe, expect, test } from 'vitest'
import { preserveNewlineIndentation } from 'src/utils'
import { renderHighlightsTemplate } from 'src/methods/renderHighlightsTemplate'
import { rawCustomTemplateWrappedTextBlockMock } from './mocks/rawTemplates'
import { renderedCustomTemplateWrappedTextBlockMock } from './mocks/renderedTemplate'
import { highlights } from './mocks/detailsData'
import { ICombinedBooksAndHighlights } from 'src/types'

describe('preserveNewlineIndentation', () => {
  test('Should handle double new line characters to preserve proper indentation in text', () => {
    const text = `This is an example text to test the handling of double newline\n\ncharacters in text.`
    const actual = preserveNewlineIndentation(text)
    const expected = `This is an example text to test the handling of double newline\ncharacters in text.`

    expect(actual).toEqual(expected)
  })

  test('Should handle multiple double new line characters to preserve proper indentation in text', () => {
    const text = `This is an example\n\ntext to test\n\nthe handling of multiple double newline\n\ncharacters in text.`
    const actual = preserveNewlineIndentation(text)
    const expected = `This is an example\ntext to test\nthe handling of multiple double newline\ncharacters in text.`

    expect(actual).toEqual(expected)
  })

  test('Should render a custom template and preserve the proper indentation when a text block is wrapped', async () => {
    const renderedTemplate = await renderHighlightsTemplate(highlights[0] as ICombinedBooksAndHighlights, rawCustomTemplateWrappedTextBlockMock);

    expect(renderedTemplate).toEqual(renderedCustomTemplateWrappedTextBlockMock);
  });
})
