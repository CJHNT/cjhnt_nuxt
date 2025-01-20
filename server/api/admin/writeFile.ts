import { writeFile } from 'node:fs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  writeFile('/Users/matthewmunson/test_nodefs.txt', body.text, (err) => {
    if (err) throw err
  })
  return 'Success'
})
