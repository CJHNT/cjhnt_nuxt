<script setup>
import { allows } from 'nuxt-authorization/utils'
import { readClosed } from '~/utils/abilities'
import parentsAndSiblings from '~/utils/parentsAndSiblings'

const { locale } = useI18n()
const { user } = useUserSession()
const projectMember = await allows(readClosed, user.value)
const props = defineProps({
  urn: { type: String, default: '' },
  reff: { type: String, default: '' },
  index: { type: Number, default: 0 }
})
const allAncestors = defineModel({ type: Array, default: [] })
const ancestors = ref([])
const navReturn = await $fetch('/api/dts/navigation', {
  body: { id: props.urn },
  method: 'POST'
})
const textMeta = await $fetch('/api/dts/collections', {
  body: { id: props.urn },
  method: 'POST'
})

const docTitle = {
  de:
    textMeta['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.['@value'] ??
    textMeta.title,
  en:
    textMeta['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.['@value'] ??
    textMeta.title
}
let parentId = props.urn.split('.').slice(0, -1).join('.')
if (textMeta['dts:dublincore'] && textMeta['dts:dublincore']['dct:isPartOf']) {
  if (typeof textMeta['dts:dublincore']['dct:isPartOf'] === 'string') {
    parentId = textMeta['dts:dublincore']['dct:isPartOf']
  } else if (Array.isArray(textMeta['dts:dublincore']['dct:isPartOf'])) {
    parentId = textMeta['dts:dublincore']['dct:isPartOf'][0]['@id']
  }
}
const { textAncestors, collMembers } = await parentsAndSiblings(parentId)
ancestors.value = [...textAncestors, { id: props.urn, title: docTitle, disabled: true, ref: '' }]
allAncestors.value.push(ancestors.value)

const citation = {
  de:
    textMeta['dts:dublincore']['dct:bibliographicCitation'].find((e) => e['@language'] === 'deu')[
      '@value'
    ] ??
    textMeta['dts:dublincore']['dct:bibliographicCitation'].find((e) => e['@language'] === 'eng')[
      '@value'
    ] ??
    '',
  en:
    textMeta['dts:dublincore']['dct:bibliographicCitation'].find((e) => e['@language'] === 'eng')[
      '@value'
    ] ??
    textMeta['dts:dublincore']['dct:bibliographicCitation'].find((e) => e['@language'] === 'deu')[
      '@value'
    ] ??
    ''
}
const memberItems = collMembers
  .filter((m) => m['@id'] !== props.urn)
  .map((m) => {
    const docTitle = {
      de:
        m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.['@value'] ??
        m.title,
      en:
        m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.['@value'] ?? m.title
    }
    const returnValue = {
      value: m['@id'],
      en: docTitle.en,
      de: docTitle.de,
      props: { to: `/texts/${m['@id']}` }
    }
    return returnValue
  })
const validReffs = navReturn['hydra:member'].map((r) => r.ref)
let usedReff = props.reff
if (!validReffs.includes(props.reff)) {
  usedReff = validReffs[0]
}
const formattedText = await $fetch('/api/dts/document', {
  body: { id: props.urn, ref: usedReff, xsl: 'assets/source/commentary.sef.json' },
  method: 'POST'
})
const parser = new DOMParser()
const domText = parser.parseFromString(formattedText, 'text/html')
const { data: ntText } = await useAsyncData('apiNtText', async () => {
  const ntElement = domText.getElementsByClassName('nt-source-text')[0]
  const ntSource = ntElement.getAttribute('source-text')
  const ntVerse = ntElement.getAttribute('source-verse')
  const apiResult = await $fetch('/api/dts/document', {
    body: { id: ntSource, ref: ntVerse, xsl: 'assets/source/nt_fragment.sef.json' },
    method: 'POST'
  })
  return apiResult
})
const engText = domText.getElementById('en-text') ? domText.getElementById('en-text').outerHTML : ''
const deuText = domText.getElementById('de-text').outerHTML
const engClass = computed(() => ({
  'h-0': locale.value === 'de',
  'overflow-hidden': locale.value === 'de'
}))
const deuClass = computed(() => ({
  'h-0': locale.value === 'en' && engText,
  'overflow-hidden': locale.value === 'en' && engText
}))
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="4" :order="index">
        <v-container>
          <v-row>
            <v-col>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="ntText" />
            </v-col>
          </v-row>
          <v-row class="my-4">
            <v-autocomplete
              :items="memberItems"
              :item-title="locale"
              density="compact"
              :hint="$t('comptext.readAnother')"
              width="200"
              persistent-hint
              clearable
            />
          </v-row>
          <v-row>
            <v-card>
              <v-card-title class="text-body-2 font-weight-bold">{{
                $t('comptext.suggestedCitation')
              }}</v-card-title>
              <v-card-text class="text-body-2">{{ citation[locale] }}</v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="8">
        <v-container>
          <v-row justify="center">
            <v-col cols="auto" class="pr-0">
              <h1>{{ docTitle[locale] }}</h1>
            </v-col>
            <v-col cols="auto" class="pl-0">
              <v-dialog max-width="500">
                <template #activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" variant="plain" size="x-small"
                    ><v-icon> mdi-copyright </v-icon></v-btn
                  >
                </template>

                <template #default="{ isActive }">
                  <v-card title="Copyright">
                    <v-card-text>{{ $t('comptext.commentaryLicense') }}</v-card-text>

                    <v-card-actions>
                      <v-spacer />

                      <v-btn :text="$t('closeDialog')" @click="isActive.value = false" />
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row class="text-content">
            <v-col>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="engText" :class="engClass" v-html="engText" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="deuText" :class="deuClass" v-html="deuText" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
/* Style the tab */
.tab {
  overflow: hidden;
}

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  float: left;
  outline: none;
  cursor: pointer;
  padding: 1px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

.sectionA p {
  font-size: smaller;
}

.beleg-section-name::after {
  content: ': ';
}

.beleg-section-name::before {
  content: '- ';
}
</style>
