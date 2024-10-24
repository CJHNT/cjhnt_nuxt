<script setup>
definePageMeta({
  middleware: ['auth']
})
const { loggedIn, user } = useUserSession()
const projectMember = await allows(readClosed, user.value)
const ntBookList = useState('ntBookList')

const tab = ref(null)
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
  // disabled because b is not user-defined input
  // eslint-disable-next-line security/detect-object-injection
  ntBookList.value.filter((b) => b in commentaryLists.value && commentaryLists.value[b].length > 0)
)
</script>

<template>
  <v-responsive>
    <AppFooter />
    <v-main class="d-flex" justify="center" style="min-height: 300px">
      <NotificationContainer />
      <template v-if="!commentaryLists">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="auto" align-self="center">
              <v-progress-circular color="primary" size="64" indeterminate />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-else>
        <v-container v-if="loggedIn">
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
                    v-if="projectMember || item.raw.openText === 'open'"
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
      </template>
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
