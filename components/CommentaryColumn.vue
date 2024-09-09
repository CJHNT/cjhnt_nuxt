<script setup>
import { Xslt, XmlParser } from 'xslt-processor'
import { parseFromString } from 'dom-parser'

const { locale } = useI18n()
const props = defineProps({ urn: String, reff: String })
const { data: navReturn } = await useFetch('/api/dts/navigation', {
  body: { id: props.urn },
  method: 'POST'
})
const { data: parentData } = await useAsyncData('apiPrevNext', async () => {
  const parentId = props.urn.split('.').slice(0, -1).join('.')
  const parentData = await $fetch('/api/dts/collections', {
    body: { id: parentId },
    method: 'POST'
  })
  return parentData
})
const docTitle = {
  de: parentData.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
    ? parentData.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
    : parentData.value.title,
  en: parentData.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
    ? parentData.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
    : parentData.value.title
}
const collMembers = [...parentData.value.member].sort((a, b) => a['@id'].localeCompare(b['@id']))
const memberItems = collMembers
  .filter((m) => m['@id'] !== props.urn)
  .map((m) => {
    const returnValue = {
      value: m['@id'],
      title: m.title.split(' ').pop(),
      props: { href: `/comptexts/${m['@id']}` }
    }
    return returnValue
  })
const validReffs = navReturn.value['hydra:member'].map((r) => r.ref)
let usedReff = props.reff
if (!validReffs.includes(props.reff)) {
  usedReff = validReffs[0]
}
const { data: xmlText } = await useFetch('/api/dts/document', {
  body: { id: props.urn, ref: usedReff },
  method: 'POST'
})
const ntFragmentXsl = (await import('../assets/source/nt_fragment.xsl?raw')).default
const rawXsl = (await import('../assets/source/commentary.xsl?raw')).default
const epidocXsl = (await import('../assets/source/epidoc.xsl?raw')).default
const xsltClass = new Xslt()
const xmlParser = new XmlParser()
const parsedXslt = xmlParser.xmlParse(rawXsl)
const parsedText = await xsltClass.xsltProcess(xmlParser.xmlParse(xmlText.value), parsedXslt)
const formattedText = parsedText
// const parser = new DOMParser()
// const domText = parser.parseFromString(formattedText, 'text/html')
const domText = parseFromString(formattedText)
const { data: ntText } = await useAsyncData('apiNtText', async () => {
  const ntElement = domText.getElementsByClassName('nt-source-text')[0]
  const ntSource = ntElement.getAttribute('source-text')
  const ntVerse = ntElement.getAttribute('source-verse')
  const apiResult = await $fetch('/api/dts/document', {
    body: { id: ntSource, ref: ntVerse },
    method: 'POST'
  })
  const processedResult = await xsltClass.xsltProcess(
    xmlParser.xmlParse(apiResult),
    xmlParser.xmlParse(ntFragmentXsl)
  )
  return processedResult.replaceAll('span><span', 'span> <span')
})
function langText() {
  if (locale.value === 'en' && parsedText.includes('lang="en"')) {
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
      const { data: collInfo } = await useFetch(`/api/dts/collections`, {
        body: { id: sourceUrn },
        method: 'POST'
      })
      var langTexts = {}
      for (const member of collInfo.value.member) {
        const { data: originalText } = await useFetch('/api/dts/document', {
          body: { id: member['@id'], ref: sourceRef },
          method: 'POST'
        })
        const processedResult = await xsltClass.xsltProcess(
          xmlParser.xmlParse(originalText.value),
          xmlParser.xmlParse(epidocXsl)
        )
        if (!['eng', 'deu'].includes(member['dts:extensions']['dc:language'])) {
          langTexts['Original'] = processedResult
        } else {
          langTexts[member['dts:extensions']['dc:language']] = processedResult
        }
      }
      const dropdownContent = document.querySelector(el.getAttribute('data-target'))
      // dropdownContent.querySelector('#belegstelle-content').innerHTML =
      //   `<p>${originalText.value}</p>`
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
      <v-col cols="4">
        <v-container>
          <v-row v-html="ntText"></v-row>
          <v-row>
            <v-autocomplete
              :items="memberItems"
              density="compact"
              :hint="$t('comptext.readAnother')"
              width="200"
              persistent-hint
              clearable
            >
            </v-autocomplete>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="8">
        <v-container>
          <v-row justify="center">
            <v-col cols="auto" class="pr-0">
              <h1>{{ docTitle[locale] }} {{ usedReff }}</h1>
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
