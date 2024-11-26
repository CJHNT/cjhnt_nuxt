// Disabled because no object injection variables come from user input
 
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let slop = '0'
  if (body.query.match_phrase.text) {
    slop = body.query.match_phrase.text.slop
  } else if (body.query.match_phrase.lemmas) {
    slop = body.query.match_phrase.lemmas.slop
  }
  const config = useRuntimeConfig(event)
  const returnData = await $fetch<EsReturn>(`${config.esUrl}/cjhnt_dev/_search?pretty`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${config.esUser}:${config.esPw}`)
    },
    body: body
  })
  // return returnData
  const returnObject = {
    total: returnData.hits.total.value,
    hits: returnData.hits.hits.map((h) => {
      const newHighlight = [] as { citation: string; highlight: string; hitIndices: string[] }[]
      if (h.highlight) {
        const hitIndices = [] as number[]
        const endIndices = [] as number[]
        const textList = h['_source'].text.split(/\s+/)
        const citationList = h['_source'].citations.split(/\s+/)
        // Find the highlighted words, map them to the citations field, then return both
        h.highlight.text?.forEach((h) => {
          h.split(/\s+/).forEach((word, wordIndex) => {
            if (word.includes('<b>')) {
              hitIndices.push(wordIndex)
            }
            if (word.includes('</b>')) {
              endIndices.push(wordIndex)
            }
          })
        })
        h.highlight.lemmas?.forEach((h) => {
          h.split(/\s+/).forEach((word, wordIndex) => {
            if (word.includes('<b>')) {
              hitIndices.push(wordIndex)
            }
            if (word.includes('</b>')) {
              endIndices.push(wordIndex)
            }
          })
        })
        hitIndices.sort((a, b) => a - b)
        endIndices.sort((a, b) => a - b)
        const highlightLength = Math.max(10, parseInt(slop))
        // I now have the word indices for the highlighting. I need to map lemmas to text and text to citations and build the string.
        // Build highlight strings
        for (let hitI = 0; hitI < hitIndices.length; hitI++) {
          const hitStartIndex = hitIndices[hitI]
          if (hitStartIndex) {
            const startIndex = Math.max(hitStartIndex - highlightLength, 0)
            let hitEndIndex = endIndices[hitI]
            const startSpans = [hitStartIndex]
            const endSpans = [endIndices[hitI]]
            while (hitIndices[hitI + 1] < hitEndIndex + highlightLength) {
              hitI++
              hitEndIndex = endIndices[hitI]
            }
            const endIndex = Math.min(hitEndIndex + highlightLength + 1, textList.length)
            let citationString = ''
            const startCitation = citationList[startIndex].split('.').slice(0, -1).join('.')
            if (startCitation) {
              citationString += `${startCitation.replaceAll(/[^\w.]/g, '')}`
              const endCitation = citationList[endIndex - 1].split('.').slice(0, -1).join('.')
              if (endCitation !== startCitation) {
                citationString += `-${endCitation.replaceAll(/[^\w.]/g, '')}`
              }
            }
            const highlightString = [] as string[]
            const hitWords = [] as string[]
            for (let i = startIndex; i < endIndex; i++) {
              let highlightWord = textList[i]
              if (hitIndices.includes(i)) {
                highlightWord = `<b>${highlightWord}`
                startSpans.push(i)
              }
              if (endIndices.includes(i)) {
                highlightWord = `${highlightWord}</b>`
                endSpans.push(i)
              }
              highlightString.push(highlightWord)
            }
            startSpans.forEach((s, index) => {
              for (let i = s; i <= endSpans[index]; i++) {
                hitWords.push(
                  citationList[i]
                    .split('.')
                    .pop()
                    ?.replaceAll(/[^\w.]/g, '') || ''
                )
              }
            })
            newHighlight.push({
              citation: citationString,
              highlight: highlightString.join(' '),
              hitIndices: hitWords.filter((e, i, a) => a.indexOf(e) === i)
            })
          }
        }
      }
      const hitObject = {
        urn: h['_source']['urn'],
        title: h['_source']['title'],
        highlight: h['highlight'] ? newHighlight : []
      }
      return hitObject
    })
  }
  return returnObject
})
