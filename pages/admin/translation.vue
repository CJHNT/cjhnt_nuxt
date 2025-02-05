<script setup lang="ts">
import { allows } from 'nuxt-authorization/utils'
import { editTranslations } from '~/utils/abilities'
import type { SubCollectionList } from '~/plugins/build-collections.client'
import type { TranslationJson } from '~/utils/buildTranslationXml'
import type { TranslationBody } from '~/server/api/admin/translation/[urn]'

const { locale } = useI18n()
const { user } = useUserSession()
const allowed = await allows(editTranslations, user.value)

const workList: Ref<SubCollectionList[]> = useState('allWorks')
const selectedWork = ref(undefined as unknown as SubCollectionList)
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

async function saveTranslation(json: TranslationJson, lang: 'deu' | 'eng') {
  const newUrls = {
    deu: cjhntDeu.value ?? workEdition.value + '_cjhnt_deu',
    eng: cjhntEng.value ?? workEdition.value + '_cjhnt_eng'
  }
  const returnCode = await $fetch('/api/admin/translation/' + newUrls[lang], {
    method: 'post',
    body: {
      editionUrn: workEdition.value,
      translationLang: lang,
      translationJson: json,
      citation: citSection.value,
      user: user.value?.email
    } as TranslationBody
  })
  console.error(returnCode)
}

async function saveToGit() {
  const returnCode = await $fetch('/api/admin/git', {
    method: 'post',
    body: {
      user: user.value?.email
    }
  })
  console.error(returnCode)
}

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
    <v-container v-if="allowed">
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
      <template v-if="showEditors">
        <v-row>
          <v-col cols="6">
            <TiptapEditor
              title="German Translation"
              lang="deu"
              :text="deuText"
              :tools="['bold', 'italic', 'undo', 'redo']"
              @save="saveTranslation"
            />
            <TiptapEditor
              title="English Translation"
              lang="eng"
              :text="engText"
              :tools="['bold', 'italic', 'undo', 'redo']"
              @save="saveTranslation"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <v-btn @click="saveToGit">{{ $t('tipTap.saveToGit') }}</v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="auto">
          <v-alert type="error"
            >{{ $t('admin.translation.notAllowed') }}
            <NuxtLink to="/">{{ $t('home') }}</NuxtLink></v-alert
          >
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
