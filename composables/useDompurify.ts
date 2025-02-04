import DOMPurify from 'dompurify'

const allowList = { ADD_TAGS: ['seg', 'w', 'ab'], ADD_ATTR: ['rend'] }

export const useDompurify = async (inputHtml: string) => {
  if (import.meta.server) {
    const { JSDOM } = await import('jsdom')
    return DOMPurify(new JSDOM('').window).sanitize(inputHtml, allowList)
  } else {
    return DOMPurify.sanitize(inputHtml, allowList)
  }
}
