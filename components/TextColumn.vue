<script setup>
import { Xslt, XmlParser } from 'xslt-processor'
const { locale } = useI18n()

const props = defineProps({ urn: String, reff: { type: String, default: 1 } })
const ancestors = ref([])
const notificationStore = useNotificationStore()
const reffDepth = () => {
  const reffSections = props.reff.match(/\./g)
  if (reffSections) {
    return reffSections.length + 1
  }
  return 1
}
const { data: docMeta } = await useFetch('/api/dts/collections', {
  body: { id: props.urn },
  method: 'POST'
})
const docTitle = {
  de: docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
    ? docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
    : docMeta.value.title,
  en: docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
    ? docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
    : docMeta.value.title
}
const parentId =
  docMeta['dts:dublincore'] && docMeta['dts:dublincore']['dct:isPartOf']
    ? docMeta.value['dts:dublincore']['dct:isPartOf']['@id']
    : props.urn.split('.').slice(0, -1).join('.')
const { data: parentData } = await useFetch('/api/dts/collections', {
  body: { id: parentId },
  method: 'POST'
})
let hasParent =
  parentData.value['dts:dublincore'] && parentData.value['dts:dublincore']['dct:isPartOf']
    ? parentData.value['dts:dublincore']['dct:isPartOf'][0]['@id']
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
  ancestors.value.unshift({ id: parentInfo['@id'], title: parentTitle })
  hasParent =
    parentInfo['dts:dublincore'] && parentInfo['dts:dublincore']['dct:isPartOf']
      ? parentInfo['dts:dublincore']['dct:isPartOf'][0]['@id']
      : false
}
const { data: navReturn } = await useFetch('/api/dts/navigation', {
  body: { id: props.urn, level: reffDepth() },
  method: 'POST'
})
const validReffs = navReturn.value['hydra:member'].map((r) => r.ref)
let usedReff = props.reff
const alertText = ref('')
if (!validReffs.includes(props.reff)) {
  await useAsyncData('refWarning', () =>
    notificationStore
      .addNotification({
        type: 'warning',
        message: `Reference ${usedReff} not found in ${docTitle[locale]}. Returning the text's first ${navReturn.value.citeType} (${validReffs[0]}).`
      })
      .then(() => true)
  )
  console.log('Notification', usedReff)
  usedReff = validReffs[0]
}

const currentIndex = validReffs.findIndex((m) => m === usedReff)
const prevId = currentIndex > 0 ? validReffs[currentIndex - 1] : null
const nextId = currentIndex + 1 < validReffs.length ? validReffs[currentIndex + 1] : null

const { data: xmlText } = await useFetch('/api/dts/document', {
  body: { id: props.urn, ref: usedReff },
  method: 'POST'
})
var rawXsl = ''
if (props.urn.includes('commentary')) {
  rawXsl = (await import('../assets/source/commentary.xsl?raw')).default
} else if (
  props.urn.includes('tlg0031') ||
  props.urn.includes('tlg0527') ||
  props.urn.includes('1henoch')
) {
  rawXsl = (await import('../assets/source/nt_fragment.xsl?raw')).default
} else if (props.urn.includes('qumran')) {
  rawXsl = (await import('../assets/source/qumran.xsl?raw')).default
} else {
  rawXsl = (await import('../assets/source/epidoc.xsl?raw')).default
}
const xsltClass = new Xslt()
const xmlParser = new XmlParser()
const parsedXslt = xmlParser.xmlParse(rawXsl)
const parsedText = await xsltClass.xsltProcess(xmlParser.xmlParse(xmlText.value), parsedXslt)
const formattedText = computed(() => {
  return parsedText.replaceAll('span><span', 'span> <span')
})
onUnmounted(() => {
  notificationStore.$reset()
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col v-if="props.urn.includes('qumran')" cols="4">
        <QumranZeichenerklärung />
      </v-col>
      <v-col cols="8">
        <v-container>
          <v-row v-if="alertText">
            <v-alert closable density="compact" type="warning">{{ alertText }}</v-alert>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-breadcrumbs :items="ancestors">
                <template v-slot:item="{ item }">
                  <nuxt-link :to="`/collection/${item.id}`">{{ item.title[locale] }}</nuxt-link>
                </template>
              </v-breadcrumbs>
            </v-col>
            <v-col cols="auto" class="pr-0">
              <h1>{{ docTitle[locale] }} {{ usedReff }}</h1>
            </v-col>
            <v-col v-if="docMeta['dts:extensions']['dc:rights']" cols="auto" class="pl-0">
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" variant="plain" size="x-small"
                    ><v-icon> mdi-copyright </v-icon></v-btn
                  >
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="Copyright">
                    <v-card-text>
                      {{ docMeta['dts:extensions']['dc:rights'] }}
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn :text="$t('closeDialog')" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row v-if="formattedText">
            <v-col cols="auto">
              <NuxtLink :to="`/texts/${props.urn};${prevId}`" v-show="prevId !== null">{{
                $t('comptext.previous')
              }}</NuxtLink>
            </v-col>
            <v-col>
              <ToReffDropdown
                :currentReff="usedReff"
                :allReffs="validReffs"
                :reffName="navReturn.citeType"
                :textUrn="props.urn"
              />
            </v-col>
            <v-col cols="auto">
              <NuxtLink :to="`/texts/${props.urn};${nextId}`" v-show="nextId !== null">{{
                $t('comptext.next')
              }}</NuxtLink>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="text-content" v-html="formattedText"></v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
