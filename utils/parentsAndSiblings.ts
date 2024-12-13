export default async function (parentId: string) {
  const parentData = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
    body: { id: parentId },
    method: 'POST'
  })
  if (parentData) {
    const parentTitle = {
      de:
        parentData['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')?.[
          '@value'
        ] ?? parentData.title,
      en:
        parentData['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')?.[
          '@value'
        ] ?? parentData.title
    }
    const ancestors = [
      {
        id: parentData['@id'],
        title: parentTitle,
        disabled: false,
        ref: ''
      }
    ]
    let hasParent: string | boolean = false
    if (parentData['dts:dublincore'] && parentData['dts:dublincore']['dct:isPartOf']) {
      if (typeof parentData['dts:dublincore']['dct:isPartOf'] === 'string') {
        hasParent = parentData['dts:dublincore']['dct:isPartOf']
      } else if (Array.isArray(parentData['dts:dublincore']['dct:isPartOf'])) {
        hasParent = parentData['dts:dublincore']['dct:isPartOf'][0]['@id']
      }
    }
    while (hasParent) {
      const parentInfo: DtsNonReadableCollection = await $fetch<DtsNonReadableCollection>(
        '/api/dts/collections',
        {
          body: { id: hasParent },
          method: 'POST'
        }
      )
      const parentTitle = {
        de:
          parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')?.[
            '@value'
          ] ?? parentInfo.title,
        en:
          parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')?.[
            '@value'
          ] ?? parentInfo.title
      }
      ancestors.unshift({
        id: parentInfo['@id'],
        title: parentTitle,
        disabled: false,
        ref: ''
      })
      if (parentInfo['dts:dublincore'] && parentInfo['dts:dublincore']['dct:isPartOf']) {
        if (typeof parentInfo['dts:dublincore']['dct:isPartOf'] === 'string') {
          hasParent = parentInfo['dts:dublincore']['dct:isPartOf']
        } else if (Array.isArray(parentInfo['dts:dublincore']['dct:isPartOf'])) {
          hasParent = parentInfo['dts:dublincore']['dct:isPartOf'][0]['@id']
        } else {
          hasParent = false
        }
      } else {
        hasParent = false
      }
    }
    const collMembers = [...parentData.member].sort((a, b) => a['@id'].localeCompare(b['@id']))
    return { textAncestors: ancestors, collMembers }
  }
  return { textAncestors: [], collMembers: [] }
}
