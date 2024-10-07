export default defineEventHandler(async () => {
  const newsItems = await $fetch(
    'https://cjhnt-info.saw-leipzig.de/++api++/@search?portal_type=News%20Item&portal_type=Event&sort_on=effective&sort_limit=3&sort_order=reverse&path.query=en'
  )
  return newsItems
})
