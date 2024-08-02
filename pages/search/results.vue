<script setup>
definePageMeta({
  middleware: ['auth']
})

const { user } = useUserSession()
const route = useRoute()
const searchParams = {
  query: { match_phrase: { text: { query: route.query.term.replaceAll('+', ' '), slop: '8' } } },
  highlight: {
    pre_tags: ['<b>'],
    post_tags: ['</b>'],
    fields: {
      text: { type: 'fvh' }
    }
  }
}
const { data: results, pending } = await useFetch('/api/elasticsearch', {
  method: 'post',
  body: searchParams
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
            <li v-else v-for="result in results">
              {{ result[0] }}
              <p v-for="phrase in result[1]" v-html="phrase"></p>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
