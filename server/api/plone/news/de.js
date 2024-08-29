export default defineEventHandler(async (event) => {
  const newsItems = await $fetch(
    'https://cjhnt-info.saw-leipzig.de/++api++/@search?portal_type=News%20Item&portal_type=Event&sort_on=created&sort_limit=3&sort_order=reverse&path.query=de'
  )
  return newsItems
})
