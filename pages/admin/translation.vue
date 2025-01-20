<script setup lang="ts">
import type { SubCollectionList } from '~/plugins/build-collections.client'

const { locale } = useI18n()

const workList: Ref<SubCollectionList[]> = useState('allWorks')
const selectedWork = ref({} as SubCollectionList)
const workEdition = ref('')
const workEditionError = ref('')
const workSections = ref([] as string[])
const citSection = ref('')
const origText = ref('')
const xslPath = ref('')

watch(selectedWork, async (newWork, oldWork) => {
  workEditionError.value = ''
  if (newWork && newWork !== oldWork) {
    citSection.value = ''
    origText.value = ''
    const edition = newWork.versions.find((v) => v[4].includes('edition'))
    if (edition) {
      let navReturn: DtsNavigation = await $fetch('/api/dts/navigation', {
        method: 'post',
        body: {
          id: edition[0],
          level: edition[5]
        }
      })
      if (navReturn.citeType === 'word') {
        navReturn = await $fetch('/api/dts/navigation', {
          method: 'post',
          body: {
            id: edition[0],
            level: edition[5] - 1
          }
        })
      }
      workSections.value = navReturn['hydra:member'].map((m) => m.ref)
      xslPath.value = chooseXsl(edition[0])
      workEdition.value = edition[0]
    } else {
      workEditionError.value = 'No edition found for this work.'
    }
  }
})

watch(citSection, async (newSection, oldSection) => {
  if (newSection && newSection !== oldSection) {
    origText.value = await $fetch('/api/dts/document', {
      method: 'post',
      body: {
        id: workEdition.value,
        ref: newSection,
        xsl: xslPath.value
      }
    })
  }
})
</script>

<template>
  <v-main>
    <v-container>
      <template v-if="workList">
        <v-autocomplete
          v-if="workList"
          v-model="selectedWork"
          :items="workList"
          :item-title="locale"
          :error-messages="workEditionError"
          label="Select a Work"
          width="400"
          return-object
          clearable
        ></v-autocomplete>
        <v-autocomplete
          v-if="selectedWork && workSections.length > 0"
          v-model="citSection"
          :items="workSections"
          label="Citation Section"
          width="150"
        ></v-autocomplete>
      </template>
      <v-row v-if="origText && selectedWork && workSections.length > 0">
        <v-col cols="6">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="origText"></div>
        </v-col>
      </v-row>
      <v-row v-if="citSection">
        <v-col cols="6">
          <TiptapTranslationEditor></TiptapTranslationEditor>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
