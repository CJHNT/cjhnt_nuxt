<script setup>
definePageMeta({
  middleware: ['project-auth']
})
const authorized = useState('authorized')
// const notificationStore = useNotificationStore()

// if (!loggedIn.value) {
//   await useAsyncData('authWarning', async () => {
//     notificationStore.addNotification({
//       type: 'warning',
//       message: '',
//       i18n: 'auth.onlyRegistered',
//       link: '/auth/login',
//       linkMessage: 'auth.login'
//     })
//   })
// }
const tab = ref(null)
const subTab = ref(null)
const { locale } = useI18n()
const programmaticChange = ref(false)
const collectionLists = useState('collList')
const searchList = useState('collSearchList')
const subColls = useState('primaryTextTabs')

async function goToSubtab(newTab, newSubtab, newId) {
  if (tab.value !== newTab) {
    programmaticChange.value = true
  }
  subTab.value = newSubtab
  tab.value = newTab
  await nextTick()
  const foundElement = document.getElementById(newId)
  foundElement.addEventListener('animationend', () => foundElement.classList.remove('flash-yellow'))
  foundElement.classList.add('flash-yellow')
}

watch(tab, (newTab) => {
  if (!programmaticChange.value) {
    subTab.value = subColls.value.find((e) => e.title === newTab).collections[0].urn
  }
  programmaticChange.value = false
})
</script>

<template>
  <v-responsive>
    <AppFooter />
    <v-main class="d-flex" justify="center" min-height="300px">
      <NotificationContainer />
      <template v-if="!collectionLists">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="auto" align-self="center">
              <v-progress-circular color="primary" size="64" indeterminate />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-else>
        <v-container v-if="authorized">
          <v-row justify="center">
            <v-col cols="12" xl="8" xxl="6">
              <v-autocomplete
                :items="searchList"
                :item-title="locale"
                no-data-text="collection.emptySearchMessage"
                open-text="collection.openMenu"
                close-text="collection.closeMenu"
                density="compact"
                :hint="$t('collection.searchHint')"
                width="200"
                persistent-hint
                clearable
              >
                <template #item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw[locale]"
                    @click="goToSubtab(item.raw.tab, item.raw.subTab, item.raw.id)"
                  />
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" xl="8" xxl="6">
              <v-card>
                <v-tabs v-model="tab">
                  <v-tab v-for="subColl in subColls" :key="subColl.title" :value="subColl.title">{{
                    $t(subColl.title)
                  }}</v-tab>
                </v-tabs>

                <v-card-text>
                  <v-tabs-window v-model="tab">
                    <v-tabs-window-item
                      v-for="subColl in subColls"
                      :key="subColl.title"
                      :value="subColl.title"
                      class="overflow-auto"
                    >
                      <v-card v-if="subColl.collections.length > 1">
                        <v-tabs v-model="subTab">
                          <v-tab
                            v-for="coll in subColl.collections"
                            :key="coll.urn"
                            :value="coll.urn"
                            >{{ $t(coll.title) }}</v-tab
                          >
                        </v-tabs>
                        <v-card-text>
                          <v-tabs-window v-model="subTab">
                            <v-tabs-window-item
                              v-for="coll in subColl.collections"
                              :key="coll.urn"
                              :value="coll.urn"
                            >
                              <CollectionList :sorted-members="collectionLists[coll.urn]" />
                            </v-tabs-window-item>
                          </v-tabs-window>
                        </v-card-text>
                      </v-card>

                      <CollectionList
                        v-else
                        :sorted-members="collectionLists[subColl.collections[0].urn]"
                      />
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
