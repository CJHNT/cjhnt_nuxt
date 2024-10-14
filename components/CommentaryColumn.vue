<script setup>
import { parseFromString } from 'dom-parser'

const { locale } = useI18n()
const props = defineProps({
  urn: { type: String, default: '' },
  reff: { type: String, default: '' },
  index: { type: Number, default: 0 }
})
const allAncestors = defineModel({ type: Array })
const ancestors = ref([])
const { data: navReturn } = await useFetch('/api/dts/navigation', {
  body: { id: props.urn },
  method: 'POST'
})
const { data: textMeta } = await useFetch('/api/dts/collections', {
  body: { id: props.urn },
  method: 'POST'
})

const docTitle = {
  de: textMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
    ? textMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
    : textMeta.value.title,
  en: textMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
    ? textMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
    : textMeta.value.title
}
let parentId = props.urn.split('.').slice(0, -1).join('.')
if (textMeta.value['dts:dublincore'] && textMeta.value['dts:dublincore']['dct:isPartOf']) {
  if (typeof textMeta.value['dts:dublincore']['dct:isPartOf'] === 'string') {
    parentId = textMeta.value['dts:dublincore']['dct:isPartOf']
  } else if (Array.isArray(textMeta.value['dts:dublincore']['dct:isPartOf'])) {
    parentId = textMeta.value['dts:dublincore']['dct:isPartOf'][0]['@id']
  }
}
const { data: parentData } = await useFetch('/api/dts/collections', {
  body: { id: parentId },
  method: 'POST'
})
const parentTitle = {
  de: parentData.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
    ? parentData.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
    : parentData.value.title,
  en: parentData.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
    ? parentData.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
    : parentData.value.title
}
ancestors.value.unshift({
  id: parentData.value['@id'],
  title: parentTitle,
  disabled: false,
  ref: ''
})
let hasParent = false
if (parentData.value['dts:dublincore'] && parentData.value['dts:dublincore']['dct:isPartOf']) {
  if (typeof parentData.value['dts:dublincore']['dct:isPartOf'] === 'string') {
    hasParent = parentData.value['dts:dublincore']['dct:isPartOf']
  } else if (Array.isArray(parentData.value['dts:dublincore']['dct:isPartOf'])) {
    hasParent = parentData.value['dts:dublincore']['dct:isPartOf'][0]['@id']
  }
}
while (hasParent) {
  const parentInfo = await $fetch('/api/dts/collections', {
    body: { id: hasParent },
    method: 'POST'
  })
  const parentTitle = {
    de: parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
      ? parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
      : parentInfo.title,
    en: parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
      ? parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
      : parentInfo.title
  }
  ancestors.value.unshift({ id: parentInfo['@id'], title: parentTitle, disabled: false, ref: '' })
  if (parentInfo['dts:dublincore'] && parentInfo['dts:dublincore']['dct:isPartOf']) {
    if (typeof parentInfo['dts:dublincore']['dct:isPartOf'] === 'string') {
      hasParent = parentInfo['dts:dublincore']['dct:isPartOf']
    } else if (Array.isArray(parentInfo['dts:dublincore']['dct:isPartOf'])) {
      hasParent = parentInfo['dts:dublincore']['dct:isPartOf'][0]['@id']
    } else {
      hasParent = false
    }
  } else {
    hasParent = false
  }
}
ancestors.value.push({ id: props.urn, title: docTitle, disabled: true, ref: '' })
allAncestors.value.push(ancestors.value)

const citation = {
  de:
    textMeta.value['dts:dublincore'] &&
    textMeta.value['dts:dublincore']['dct:bibliographicCitation'].find(
      (e) => e['@language'] === 'deu'
    )
      ? textMeta.value['dts:dublincore'] &&
        textMeta.value['dts:dublincore']['dct:bibliographicCitation'].find(
          (e) => e['@language'] === 'deu'
        )['@value']
      : '',
  en:
    textMeta.value['dts:dublincore'] &&
    textMeta.value['dts:dublincore']['dct:bibliographicCitation'].find(
      (e) => e['@language'] === 'eng'
    )
      ? textMeta.value['dts:dublincore'] &&
        textMeta.value['dts:dublincore']['dct:bibliographicCitation'].find(
          (e) => e['@language'] === 'eng'
        )['@value']
      : ''
}
const collMembers = [...parentData.value.member].sort((a, b) => a['@id'].localeCompare(b['@id']))
const memberItems = collMembers
  .filter((m) => m['@id'] !== props.urn)
  .map((m) => {
    const docTitle = {
      de: m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
        ? m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
        : m.title,
      en: m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
        ? m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
        : m.title
    }
    const returnValue = {
      value: m['@id'],
      en: docTitle.en,
      de: docTitle.de,
      props: { to: `/texts/${m['@id']}` }
    }
    return returnValue
  })
const validReffs = navReturn.value['hydra:member'].map((r) => r.ref)
let usedReff = props.reff
if (!validReffs.includes(props.reff)) {
  usedReff = validReffs[0]
}
const { data: formattedText } = await useFetch('/api/dts/document', {
  body: { id: props.urn, ref: usedReff, xsl: 'assets/source/commentary.sef.json' },
  method: 'POST'
})
const domText = parseFromString(formattedText.value)
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
function langText() {
  if (locale.value === 'en' && formattedText.value.includes('lang="en"')) {
    return domText.getElementById('en-text').outerHTML
  } else {
    return domText.getElementById('de-text').outerHTML
  }
}
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
              <div v-html="langText()" />
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
