<script setup>
definePageMeta({
  middleware: ['auth']
})
const ntBookList = useState('ntBookList')

const tab = ref(null)
const { user } = useUserSession()
const { locale } = useI18n()
const commentaryLists = useState('commentaryList')
const searchList = useState('commentarySearchList')

async function goToSubtab(newTab, newId) {
  tab.value = newTab
  await nextTick()
  const foundElement = document.getElementById(newId)
  foundElement.addEventListener('animationend', () => foundElement.classList.remove('flash-yellow'))
  foundElement.classList.add('flash-yellow')
}
const existingCommentaries = computed(() =>
  ntBookList.value.filter((b) => b in commentaryLists.value)
)
</script>

<template>
  <v-responsive>
    <AppFooter />
    <v-main class="d-flex" justify="center" style="min-height: 300px">
      <v-container v-if="user?.role === 'user'" class="text-column">
        <v-alert type="warning"
          >{{ $t('auth.onlyProject') }} <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
        >
      </v-container>
      <v-container v-else>
        <v-row justify="center">
          <v-col cols="12" xl="8" xxl="6">
            <v-autocomplete
              :items="searchList"
              :item-title="locale"
              no-data-text="collection.emptySearchMessage"
              open-text="collection.commentaryOpenMenu"
              close-text="collection.commentaryCloseMenu"
              density="compact"
              :hint="$t('collection.commentarySearchHint')"
              width="200"
              persistent-hint
              clearable
            >
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw[locale]"
                  @click="goToSubtab(item.raw.tab, item.raw.id)"
                />
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" xl="8" xxl="6">
            <v-card>
              <v-tabs v-model="tab">
                <v-tab
                  v-for="commentaryId in existingCommentaries"
                  :key="commentaryId"
                  :value="commentaryId"
                  >{{ commentaryLists[commentaryId][0].parentTitle[locale] }}</v-tab
                >
              </v-tabs>

              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item
                    v-for="commentaryId in existingCommentaries"
                    :key="commentaryId"
                    :value="commentaryId"
                    class="overflow-auto"
                  >
                    <CollectionList :sorted-members="commentaryLists[commentaryId]" />
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-responsive>
</template>

<style>
@keyframes work-focus {
  from {
    background-color: yellow;
  }
  to {
    background-color: initial;
  }
}

.flash-yellow {
  animation-name: work-focus;
  animation-duration: 5s;
}
</style>
