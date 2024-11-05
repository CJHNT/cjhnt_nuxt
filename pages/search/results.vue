<script setup>
definePageMeta({
  middleware: ['auth']
})
const { loggedIn, user } = useUserSession()

const route = useRoute()
const queryType = route.query.field === 'belegstellen' ? 'match_phrase_prefix' : 'match_phrase'
const slop = route.query.field === 'belegstellen' ? '0' : route.query.slop || '8'
const highlighter = 'unified'
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
      [route.query.field]: { type: highlighter, number_of_fragments: 0 }
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
  { title: 'document', key: 'title' },
  { title: 'search.hits', key: 'highlight', value: (item) => item.highlight[route.query.field] }
]
const tableSearch = ref('')
</script>

<template>
  <v-main style="min-height: 300px">
    <NotificationContainer />
    <v-container v-if="loggedIn">
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
            no-data-text="search.noResults"
          >
            <template #headers="{ columns }">
              <tr>
                <template v-for="column in columns" :key="column.key">
                  <th>{{ $t(column.title) }}</th>
                </template>
              </tr>
            </template>
            <template #[`item.title`]="{ item }">
              <nuxt-link
                v-if="item.urn.includes('cjhnt:commentary') || item.urn.includes('cjhnt:info')"
                :to="`/texts/${item.urn}`"
                >{{ item.title }}</nuxt-link
              >
              <template v-else>{{ item.title }}</template>
            </template>
            <template #[`item.highlight`]="{ item }">
              <ul class="ml-4">
                <template v-for="(highlight, index) in item.highlight" :key="index">
                  <li>
                    <template
                      v-if="item.openText === 'open' || ['admin', 'project'].includes(user.role)"
                    >
                      <nuxt-link
                        v-if="highlight.citation"
                        :to="`/texts/${item.urn};${highlight.citation}`"
                        >{{ highlight.citation }}:
                      </nuxt-link>
                      <!-- Disabled because highlight.highlight is not user input -->
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <span v-html="highlight.highlight" />
                    </template>
                    <span v-else>{{ highlight.citation }}: {{ $t('comptext.onlyProject') }}</span>
                  </li>
                </template>
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
