// Disabled because no object injection variables come from user input
/* eslint-disable security/detect-object-injection */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
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
      const newHighlight = [] as { citation: string; highlight: string }[]
      if (h.highlight) {
        const hitIndices = [] as number[]
        const textList = h['_source'].text.split(' ')
        const citationList = h['_source'].citations.split(' ')
        // Find the highlighted words, map them to the citations field, then return both
        h.highlight.text?.forEach((h) => {
          h.split(' ').forEach((word, wordIndex) => {
            if (word.startsWith('<b>')) {
              hitIndices.push(wordIndex)
            }
          })
        })
        h.highlight.lemmas?.forEach((h) => {
          h.split(' ').forEach((word, wordIndex) => {
            if (word.startsWith('<b>')) {
              hitIndices.push(wordIndex)
            }
          })
        })
        hitIndices.sort((a, b) => a - b)
        // I now have the word indices for the highlighting. I need to map lemmas to text and text to citations and build the string.
        // Build highlight strings
        for (let hitI = 0; hitI < hitIndices.length; hitI++) {
          let currentIndex = hitIndices[hitI]
          if (currentIndex) {
            const startIndex = Math.max(currentIndex - 10, 0)
            while (hitIndices[hitI + 1] < currentIndex + 10) {
              hitI++
              currentIndex = hitIndices[hitI]
            }
            const endIndex = Math.min(currentIndex + 11, textList.length)
            let citationString = ''
            const startCitation = citationList[startIndex]
            if (startCitation) {
              citationString += `${startCitation}`
              if (citationList[endIndex] !== startCitation) {
                citationString += `-${citationList[endIndex]}`
              }
            }
            const highlightString = [] as string[]
            for (let i = startIndex; i < endIndex; i++) {
              const highlightWord = hitIndices.includes(i) ? `<b>${textList[i]}</b>` : textList[i]
              highlightString.push(highlightWord)
            }
            newHighlight.push({ citation: citationString, highlight: highlightString.join(' ') })
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
