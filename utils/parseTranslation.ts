export default function (xml: string) {
  const parser = new DOMParser()
  const newHtml = parser.parseFromString('<body></body>', 'text/html')
  const domText = parser.parseFromString(xml, 'text/html')
  domText.querySelectorAll('span.text-paragraph').forEach((p) => {
    const newP = newHtml.createElement('p')
    p.childNodes.forEach((c) => {
      if (c.textContent) {
        const newText = newHtml.createTextNode(c.textContent)
        newP.appendChild(newText)
      }
    })
    newHtml.body.appendChild(newP)
  })
  return newHtml.body.innerHTML
}
