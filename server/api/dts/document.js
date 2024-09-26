import SaxonJS from 'saxon-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const returnData = await $fetch('http://127.0.0.1:5000/api/dts/document', {
    query: { id: body.id, ref: body.ref }
  })
  // return returnData
  const returnHtml = SaxonJS.transform({
    stylesheetFileName: body.xsl,
    sourceText: returnData,
    destination: 'serialized'
  })
  return returnHtml.principalResult
})
