interface TextMarks {
  type: 'bold' | 'italic'
}

interface TranslationText {
  type: 'text'
  marks?: TextMarks[]
  text: string
}

interface TranslationParagraph {
  type: 'paragraph'
  content: TranslationText[]
}

interface TranslationJson {
  type: 'doc'
  content: TranslationParagraph[]
}

const wordRe = /(\W*)(\w+)(\W*)/g

export default function (tipTapJson: TranslationJson) {
  let xmlString = ''
  tipTapJson.content.forEach((p) => {
    xmlString = xmlString.concat('<p>')
    p.content.forEach((t) => {
      let endTag = ''
      if (t.marks) {
        const marksArray = [] as string[]
        t.marks.forEach((mark) => {
          if (mark.type === 'bold') {
            marksArray.push('font-weight-bold')
          } else if (mark.type === 'italic') {
            marksArray.push('font-italic')
          }
        })
        xmlString = xmlString.concat(`<seg rend="${marksArray.join(' ')}">`)
        endTag = endTag.concat('</seg>')
      }
      const matches = [...t.text.matchAll(wordRe)]
      if (matches.length > 0) {
        matches.forEach((group) => {
          xmlString = xmlString.concat(`${group[1]}<w>${group[2]}</w>${group[3]}`)
        })
      } else {
        xmlString = xmlString.concat(t.text)
      }
      xmlString = xmlString.concat(endTag)
    })
    xmlString = xmlString.concat('</p>')
  })
  return xmlString
}

export type { TranslationJson }
