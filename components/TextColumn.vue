<script setup>
import { Xslt, XmlParser } from 'xslt-processor'

const props = defineProps({ urn: String, reff: { type: String, default: 1 } })
const reffDepth = () => {
  const reffSections = props.reff.match(/\./g)
  if (reffSections) {
    return reffSections.length + 1
  }
  return 1
}
const { data: navReturn } = await useFetch('/api/dts/navigation', {
  body: { id: props.urn, level: reffDepth() },
  method: 'POST'
})
const validReffs = navReturn.value['hydra:member'].map((r) => r.ref)
let usedReff = props.reff
const alertText = ref('')
if (!validReffs.includes(props.reff)) {
  alertText.value = `Reference ${usedReff} not found in ${props.urn}. Returning the text's first ${navReturn.value.citeType} (${validReffs[0]}).`
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
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col v-if="props.urn.includes('qumran')" cols="4">
        <template>
          <QumranZeichenerklärung />
        </template>
      </v-col>
      <v-col cols="8">
        <v-container>
          <v-row v-if="alertText">
            <v-alert closable density="compact" type="warning">{{ alertText }}</v-alert>
          </v-row>
          <v-row v-if="formattedText">
            <v-col cols="auto">
              <NuxtLink :to="`/comptexts/${props.urn};${prevId}`" v-show="prevId !== null"
                >Previous {{ navReturn.citeType }}</NuxtLink
              >
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
              <NuxtLink :to="`/comptexts/${props.urn};${nextId}`" v-show="nextId !== null"
                >Next {{ navReturn.citeType }}</NuxtLink
              >
            </v-col>
          </v-row>
        </v-container>
        <v-container class="text-content" v-html="formattedText"></v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
