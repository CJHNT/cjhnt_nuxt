describe('parentsAndSiblings', async () => {
  const { textAncestors, collMembers } = await parentsAndSiblings('urn:cts:cjhnt:commentary.1tim')
  test('number of parents and siblings is correct', () => {
    expect(textAncestors).toHaveLength(2)
    expect(collMembers).toHaveLength(77)
  })
  test('parent ids are correct', () => {
    expect(textAncestors[1].id).toBe('urn:cts:cjhnt:commentary.1tim')
    expect(textAncestors[0].id).toBe('urn:cts:cjhnt:commentary')
  })
  test('parent titles are correct', () => {
    expect(textAncestors[1].title).toStrictEqual({
      de: 'Kommentar zu 1. Timotheus',
      en: 'Commentary on 1 Timothy'
    })
    expect(textAncestors[0].title).toStrictEqual({
      de: 'Kommentare',
      en: 'Commentaries'
    })
  })
  test('sibling ids are correct and in correct order', () => {
    expect(collMembers[0]['@id']).toBe('urn:cts:cjhnt:commentary.1tim.001_001_001')
    expect(collMembers[1]['@id']).toBe('urn:cts:cjhnt:commentary.1tim.001_001_002')
    expect(collMembers[76]['@id']).toBe('urn:cts:cjhnt:commentary.1tim.006_020')
  })
})
