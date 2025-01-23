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
const cjhntDeu = ref<string | undefined>('')
const cjhntEng = ref<string | undefined>('')
const deuText = ref('')
const engText = ref('')
const xslPath = ref('')
const showEditors = ref(false)

watch(selectedWork, async (newWork, oldWork) => {
  workEditionError.value = ''
  if (newWork && newWork !== oldWork) {
    showEditors.value = false
    citSection.value = ''
    origText.value = ''
    const edition = newWork.versions.find((v) => v[4].includes('edition'))
    cjhntDeu.value = newWork.versions.find((v) => v[0].includes('cjhnt_deu'))?.[0]
    cjhntEng.value = newWork.versions.find((v) => v[0].includes('cjhnt_eng'))?.[0]
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
    showEditors.value = false
    origText.value = await $fetch('/api/dts/document', {
      method: 'post',
      body: {
        id: workEdition.value,
        ref: newSection,
        xsl: xslPath.value
      }
    })
    if (cjhntDeu.value) {
      const deutsch = await $fetch('/api/dts/document', {
        method: 'post',
        body: {
          id: cjhntDeu.value,
          ref: newSection,
          xsl: xslPath.value
        }
      })
      deuText.value = parseTranslation(deutsch)
    }
    if (cjhntEng.value) {
      const english = await $fetch('/api/dts/document', {
        method: 'post',
        body: {
          id: cjhntEng.value,
          ref: newSection,
          xsl: xslPath.value
        }
      })
      engText.value = parseTranslation(english)
    }
  }
  showEditors.value = true
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
          <div class="text-h5">Original Language</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="origText"></div>
        </v-col>
      </v-row>
      <v-row v-if="showEditors">
        <v-col cols="6">
          <TiptapEditor
            title="German Translation"
            :text="deuText"
            :tools="['paragraph', 'undo', 'redo']"
          />
          <TiptapEditor
            title="English Translation"
            :text="engText"
            :tools="['paragraph', 'undo', 'redo']"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
