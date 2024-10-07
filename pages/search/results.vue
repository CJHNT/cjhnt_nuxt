<script setup>
definePageMeta({
  middleware: ['auth']
})

const { user } = useUserSession()
const route = useRoute()
const queryType = route.query.field === 'belegstellen' ? 'match_phrase_prefix' : 'match_phrase'
const slop = route.query.field === 'belegstellen' ? '0' : route.query.slop || '8'
const highlighter = route.query.field === 'belegstellen' ? 'unified' : 'fvh'
const searchParams = {
  size: 10000,
  query: {
    [queryType]: {
      [route.query.field]: {
        query: route.query.term.replaceAll('+', ' '),
        slop: slop
      }
    }
  },
  highlight: {
    pre_tags: ['<b>'],
    post_tags: ['</b>'],
    fields: {
      [route.query.field]: { type: highlighter }
    }
  },
  sort: [{ urn: { order: 'asc' } }],
  from: route.query.page ? (route.query.page - 1) * 10 : 0
}
const { data: results } = await useFetch('/api/elasticsearch', {
  method: 'post',
  body: searchParams
})
const tableHeaders = [
  { title: 'Document', key: 'title' },
  { title: 'Hits', key: 'highlight', value: (item) => item.highlight[route.query.field] }
]
const tableSearch = ref('')
</script>

<template>
  <v-main style="min-height: 300px">
    <v-container v-if="user?.role === 'user'" class="text-column">
      <v-alert type="warning"
        >{{ $t('auth.onlyProject') }} <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
      >
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="12" md="9" xl="6">
          <h1>{{ $t('search.results') }}</h1>
          <v-text-field
            v-model="tableSearch"
            width="300"
            :label="$t('search.searchResults')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            clearable
          />
          <v-data-table
            v-model:search="tableSearch"
            :headers="tableHeaders"
            :items="results.hits"
            :items-per-page-text="$t('search.itemsPerPage')"
            :show-current-page="true"
            page-text=""
            :items-per-page-options="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: $t('search.itemPerPageAll') }
            ]"
            :no-data-text="$t('search.noResults')"
          >
            <template #[`item.title`]="{ item }">
              <nuxt-link :to="`/texts/${item.urn}`">{{ item.title }}</nuxt-link>
            </template>
            <template #[`item.highlight`]="{ item }">
              <ul class="ml-4">
                <li v-for="(phrase, field, index) in item.highlight" :key="index">
                  <template v-if="item.highlight.length > 1">
                    <h4>{{ field.charAt(0).toUpperCase() + field.slice(1) }}</h4>
                    <ul class="ml-4">
                      <li v-for="(p, pIndex) in phrase" :key="pIndex" v-html="p" />
                    </ul>
                  </template>
                  <template v-else>
                    <li v-for="(p, pIndex) in phrase" :key="pIndex" v-html="p" />
                  </template>
                </li>
              </ul>
            </template>
          </v-data-table>
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
