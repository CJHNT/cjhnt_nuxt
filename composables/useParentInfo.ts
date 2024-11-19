export default async function (parentId: string) {
  const { data: parentData } = await useFetch<DtsNonReadableCollection>('/api/dts/collections', {
    body: { id: parentId },
    method: 'POST'
  })
  if (parentData.value) {
    const parentTitle = {
      de:
        parentData.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')?.[
          '@value'
        ] ?? parentData.value.title,
      en:
        parentData.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')?.[
          '@value'
        ] ?? parentData.value.title
    }
    const ancestors = [
      {
        id: parentData.value['@id'],
        title: parentTitle,
        disabled: false,
        ref: ''
      }
    ]
    let hasParent: string | boolean = false
    if (parentData.value['dts:dublincore'] && parentData.value['dts:dublincore']['dct:isPartOf']) {
      if (typeof parentData.value['dts:dublincore']['dct:isPartOf'] === 'string') {
        hasParent = parentData.value['dts:dublincore']['dct:isPartOf']
      } else if (Array.isArray(parentData.value['dts:dublincore']['dct:isPartOf'])) {
        hasParent = parentData.value['dts:dublincore']['dct:isPartOf'][0]['@id']
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
    const collMembers = [...parentData.value.member].sort((a, b) =>
      a['@id'].localeCompare(b['@id'])
    )
    return { textAncestors: ancestors, collMembers }
  }
  return [{}]
}
