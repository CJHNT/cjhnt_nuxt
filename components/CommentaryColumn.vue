<script setup>
import { parseFromString } from 'dom-parser'

const { locale } = useI18n()
const props = defineProps({ urn: String, reff: String, index: Number })
const allAncestors = defineModel()
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
const { data: parentData } = await useAsyncData('apiPrevNext', async () => {
  const parentId =
    textMeta['dts:dublincore'] && textMeta['dts:dublincore']['dct:isPartOf']
      ? textMeta.value['dts:dublincore']['dct:isPartOf']['@id']
      : props.urn.split('.').slice(0, -1).join('.')
  const parentData = await $fetch('/api/dts/collections', {
    body: { id: parentId },
    method: 'POST'
  })
  const parentTitle = {
    de: parentData['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
      ? parentData['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
      : parentData.title,
    en: parentData['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
      ? parentData['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
      : parentData.title
  }
  ancestors.value.unshift({ id: parentId, title: parentTitle, disabled: false, ref: '' })
  let hasParent =
    parentData['dts:dublincore'] && parentData['dts:dublincore']['dct:isPartOf']
      ? parentData['dts:dublincore']['dct:isPartOf'][0]['@id']
      : false
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
    hasParent =
      parentInfo['dts:dublincore'] && parentInfo['dts:dublincore']['dct:isPartOf']
        ? parentInfo['dts:dublincore']['dct:isPartOf'][0]['@id']
        : false
  }
  ancestors.value.push({ id: props.urn, title: docTitle, disabled: true, ref: '' })
  return parentData
})
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
      props: { href: `/texts/${m['@id']}` }
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

onMounted(() => {
  const belegDropdowns = document.querySelectorAll('.belegstelle-button')
  belegDropdowns.forEach((element) =>
    element.addEventListener('click', async (event) => {
      const el = event.currentTarget
      const sourceUrn = el.getAttribute('source-text')
      const sourceRef = el.getAttribute('source-verse')
      const collInfo = await $fetch(`/api/dts/collections`, {
        body: { id: sourceUrn },
        method: 'POST'
      })
      var langTexts = {}
      for (const member of collInfo.member) {
        const xslPath = () => {
          switch (true) {
            case member['@id'].includes('commentary'):
              return 'assets/source/commentary.sef.json'
            case member['@id'].includes('tlg0031'):
            case member['@id'].includes('tlg0527'):
            case member['@id'].includes('1henoch'):
              return 'assets/source/nt_fragment.sef.json'
            case member['@id'].includes('qumran'):
              return 'assets/source/qumran.sef.json'
            default:
              return 'assets/source/epidoc.sef.json'
          }
        }
        const processedResult = await $fetch('/api/dts/document', {
          body: { id: member['@id'], ref: sourceRef, xsl: xslPath() },
          method: 'POST'
        })

        if (!['eng', 'deu'].includes(member['dts:extensions']['dc:language'])) {
          langTexts['Original'] = processedResult
        } else {
          langTexts[member['dts:extensions']['dc:language']] = processedResult
        }
      }
      const dropdownContent = document.querySelector(el.getAttribute('data-target'))
      const tabRow = dropdownContent.querySelector('.tab')
      const langContents = dropdownContent.querySelector('.tabcontent')
      tabRow.innerHTML = ''
      langContents.innerHTML = ''
      for (const [key, value] of Object.entries(langTexts)) {
        const template = document.createElement('template')
        const contentTemplate = document.createElement('template')
        const active = key === 'Original' ? ' active' : ''
        const order = key === 'Original' ? ' order-1' : ' order-2'
        const langKey = key === 'eng' ? 'English' : key === 'deu' ? 'Deutsch' : 'Original'
        template.innerHTML = `<button class="tablinks border-sm flex-grow-1${active}${order}" onclick="belegLanguage(event, '${sourceUrn}-${key}-section-b')">${langKey}</button>`
        const result = template.content
        tabRow.append(result)
        const display = key === 'Original' ? '' : ' d-none'
        contentTemplate.innerHTML = `<div class="section-b-tabcontent${display}" id="${sourceUrn}-${key}-section-b">${value}</div>`
        langContents.append(contentTemplate.content)
      }
      const buttonIcon = document.getElementById(el.getAttribute('id') + '-chevron')
      dropdownContent.classList.toggle('border-opacity-0')
      if (dropdownContent.style.maxHeight) {
        dropdownContent.style.maxHeight = null
        dropdownContent.style.opacity = 0
      } else {
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px'
        dropdownContent.style.opacity = 1
      }
      buttonIcon.classList.toggle('mdi-chevron-down')
      buttonIcon.classList.toggle('mdi-chevron-up')
    })
  )
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="4" :order="index">
        <v-container>
          <v-row v-html="ntText"></v-row>
          <v-row class="my-4">
            <v-autocomplete
              :items="memberItems"
              :item-title="locale"
              density="compact"
              :hint="$t('comptext.readAnother')"
              width="200"
              persistent-hint
              clearable
            >
            </v-autocomplete>
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
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" variant="plain" size="x-small"
                    ><v-icon> mdi-copyright </v-icon></v-btn
                  >
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="Copyright">
                    <v-card-text>{{ $t('comptext.commentaryLicense') }}</v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn :text="$t('closeDialog')" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row class="text-content" v-html="langText()"> </v-row>
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
