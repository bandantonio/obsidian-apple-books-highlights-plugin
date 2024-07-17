import { describe, expect, test } from 'vitest'
import { removeTrailingSpaces } from 'src/utils'

describe('removeTrailingSpaces', () => {
  test('Should remove a newline character at the end of text', () => {
    const text = `This is an example text to test the removal of a newline character at the end of the text.\n`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of a newline character at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove double newline characters at the end of text', () => {
    const text = `This is an example text to test the removal of double newline characters at the end of the text.\n\n`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of double newline characters at the end of the text.`
    
    expect(actual).toEqual(expected)
  })
  
  test('Should remove triple newline characters at the end of text', () => {
    const text = `This is an example text to test the removal of triple newline characters at the end of the text.\n\n\n`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of triple newline characters at the end of the text.`
    
    expect(actual).toEqual(expected)
  })
  
  test('Should remove many newline characters at the end of text', () => {
    const text = `This is an example text to test the removal of many newline characters at the end of the text.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many newline characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove many newline characters at the end of text while preserving space, tab and newline characters within the text', () => {
    const text = `This is an example text to test the removal of many newline characters at the end of the text while preserving space , tab\t and newline\n characters within the text.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many newline characters at the end of the text while preserving space , tab\t and newline\n characters within the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove a tab character at the end of text', () => {
    const text = `This is an example text to test the removal of a tab character at the end of the text.\t`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of a tab character at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove double tab characters at the end of text', () => {
    const text = `This is an example text to test the removal of double tab characters at the end of the text.\t\t`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of double tab characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove triple tab characters at the end of text', () => {
    const text = `This is an example text to test the removal of triple tab characters at the end of the text.\t\t\t`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of triple tab characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove many tab characters at the end of text', () => {
    const text = `This is an example text to test the removal of many tab characters at the end of the text.\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many tab characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove many tab characters at the end of text while preserving space, tab and newline characters within the text', () => {
    const text = `This is an example text to test the removal of many tab characters at the end of the text while preserving space , tab\t and newline\n characters within the text.\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many tab characters at the end of the text while preserving space , tab\t and newline\n characters within the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove a space character at the end of text', () => {
    const text = `This is an example text to test the removal of a space character at the end of the text. `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of a space character at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove double space characters at the end of text', () => {
    const text = `This is an example text to test the removal of double space characters at the end of the text.  `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of double space characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove triple space characters at the end of text', () => {
    const text = `This is an example text to test the removal of triple space characters at the end of the text.   `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of triple space characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove many space characters at the end of text', () => {
    const text = `This is an example text to test the removal of many space characters at the end of the text.                              `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many space characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove many space characters at the end of text while preserving space, tab and newline characters at the end of the text.', () => {
    const text = `This is an example text to test the removal of many space characters at the end of the text preserving space , tab\b and newline\n characters at the end of the text.                              `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many space characters at the end of the text preserving space , tab\b and newline\n characters at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should remove multiple space, tab and newline characters at the end of text', () => {
    const text = `This is an example text to test the removal of many space, tab and newline characters at the end of the text. \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many space, tab and newline characters at the end of the text.`
    
    expect(actual).toEqual(expected)
  })

  test('Should remove multiple space, tab and newline characters at the end of text while preserving space, tab and newline characters within text', () => {
    const text = `This is an example text to test the removal of many space , tab\t and newline\n characters at the end of the text while preserving space, tab and newline characters within text. \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t \n\t `
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test the removal of many space , tab\t and newline\n characters at the end of the text while preserving space, tab and newline characters within text.`
    
    expect(actual).toEqual(expected)
  })
  
  test('Should return the text when no space, tab or newline characters exist at the end of the text', () => {
    const text = `This is an example text to test that the text is returned when no space, tab or newline characters exist at the end of the text.`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test that the text is returned when no space, tab or newline characters exist at the end of the text.`

    expect(actual).toEqual(expected)
  })

  test('Should return the text when no space, tab or newline characters exist at the end of the text while preserving space, tab and newline characters within text', () => {
    const text = `This is an example text to test that the text is returned when no space , tab\t or newline\n characters exist at the end of the text while preserving space, tab and newline characters within text.`
    const actual = removeTrailingSpaces(text)
    const expected = `This is an example text to test that the text is returned when no space , tab\t or newline\n characters exist at the end of the text while preserving space, tab and newline characters within text.`

    expect(actual).toEqual(expected)
  })
})
