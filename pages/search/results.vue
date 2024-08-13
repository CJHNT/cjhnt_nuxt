<script setup>
definePageMeta({
  middleware: ['auth']
})

const { user } = useUserSession()
const route = useRoute()
const searchParams = {
  query: {
    match_phrase: {
      text: {
        query: route.query.term.replaceAll('+', ' '),
        slop: route.query.slop || '8'
      }
    }
  },
  highlight: {
    pre_tags: ['<b>'],
    post_tags: ['</b>'],
    fields: {
      text: { type: 'fvh' }
    }
  },
  sort: [{ urn: { order: 'asc' } }],
  from: route.query.page ? (route.query.page - 1) * 10 : 0
}
const { data: results, pending } = await useFetch('/api/elasticsearch', {
  method: 'post',
  body: searchParams
})

const searchPages = computed(() => {
  const totalPages = Math.ceil(results.value.total / 10)
  const allPageArray = [...Array(totalPages).keys()]
  const removeIndex = allPageArray.indexOf(parseInt(route.query.page) - 1)
  allPageArray.splice(removeIndex, 1)
  return allPageArray
})
</script>

<template>
  <v-main style="min-height: 300px">
    <v-container v-if="user.role === 'user'">
      <v-alert type="warning"
        >This page is only available to project members.
        <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
      >
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="auto">
          <h1>Search Results</h1>
          <ul class="collection-list">
            <li v-if="pending">Loading...</li>
            <li v-else v-for="result in results.hits">
              <nuxt-link :to="`/comptexts/${result[0]}`">{{ result[1] }}</nuxt-link>
              <ul>
                <li v-for="phrase in result[2]" v-html="phrase"></li>
              </ul>
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="1">
          <a
            v-if="route.query.page && parseInt(route.query.page) !== 1"
            :href="`/search/results?term=${route.query.term}&page=${route.query.page ? parseInt(route.query.page) - 1 : 1}`"
            >Previous</a
          >
        </v-col>
        <v-col cols="auto">
          <a
            class="page-link"
            v-for="searchPage in searchPages"
            :href="`/search/results?term=${route.query.term}&page=${searchPage + 1}`"
            >{{ searchPage + 1 }}</a
          >
        </v-col>
        <v-col cols="1" class="text-right">
          <a
            v-if="route.query.page && parseInt(route.query.page) * 10 <= results.total"
            :href="`/search/results?term=${route.query.term}&page=${route.query.page ? parseInt(route.query.page) + 1 : 1}`"
            >Next</a
          >
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.page-link {
  padding-left: 1rem;
}
</style>
