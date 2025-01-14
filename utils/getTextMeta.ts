export function getParentId(metadata: DtsNonReadableCollection) {
  if (metadata['dts:dublincore']?.['dct:isPartOf']) {
    if (typeof metadata['dts:dublincore']['dct:isPartOf'] === 'string') {
      return metadata['dts:dublincore']['dct:isPartOf']
    } else if (Array.isArray(metadata['dts:dublincore']['dct:isPartOf'])) {
      return metadata['dts:dublincore']['dct:isPartOf'][0]['@id']
    }
  }
  return null
}

export function getEnDeBibliography(metadata: DtsNonReadableCollection) {
  return {
    de:
      metadata['dts:dublincore']?.['dct:bibliographicCitation']?.find(
        (e) => e['@language'] === 'deu'
      )?.['@value'] ??
      metadata['dts:dublincore']?.['dct:bibliographicCitation']?.[0]['@value'] ??
      metadata['dts:extensions']['dc:language'][0],
    en:
      metadata['dts:dublincore']?.['dct:bibliographicCitation']?.find(
        (e) => e['@language'] === 'eng'
      )?.['@value'] ??
      metadata['dts:dublincore']?.['dct:bibliographicCitation']?.[0]['@value'] ??
      metadata['dts:extensions']['dc:language'][0]
  }
}

export function checkOpenText(metadata: DtsNonReadableCollection) {
  return metadata['dts:dublincore'] && metadata['dts:dublincore']['dct:accessRights'] === 'open'
}

export function getDocTitle(metadata: DtsNonReadableCollection) {
  return {
    de:
      metadata['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.['@value'] ??
      metadata.title,
    en:
      metadata['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.['@value'] ??
      metadata.title
  }
}
