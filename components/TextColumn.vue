<script setup>
const { locale } = useI18n()

const props = defineProps({ urn: String, reff: { type: String, default: 1 } })
const allAncestors = defineModel()
const ancestors = ref([])
const notificationStore = useNotificationStore()
const reffDepth = () => {
  const reffSections = props.reff.match(/\./g)
  if (reffSections) {
    return reffSections.length + 1
  }
  return 1
}
const { data: docMeta } = await useAsyncData(props.urn + props.reff, async () =>
  $fetch('/api/dts/collections', {
    body: { id: props.urn },
    method: 'POST'
  })
)
const docTitle = {
  de: docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
    ? docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
    : docMeta.value.title,
  en: docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
    ? docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
    : docMeta.value.title
}
let parentId = props.urn.split('.').slice(0, -1).join('.')
if (docMeta.value['dts:dublincore'] && docMeta.value['dts:dublincore']['dct:isPartOf']) {
  if (typeof docMeta.value['dts:dublincore']['dct:isPartOf'] === 'string') {
    parentId = docMeta.value['dts:dublincore']['dct:isPartOf']
  } else if (Array.isArray(docMeta.value['dts:dublincore']['dct:isPartOf'])) {
    parentId = docMeta.value['dts:dublincore']['dct:isPartOf'][0]['@id']
  }
}
const { data: parentData } = await useAsyncData(parentId, () =>
  $fetch('/api/dts/collections', {
    body: { id: parentId },
    method: 'POST'
  })
)
const siblings = parentData.value.member
  .map((m) => [m['@id'], m['dts:extensions']['dc:language']])
  .filter((c) => c[0] !== props.urn)
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
const { data: navReturn } = await useAsyncData(`${props.urn}level${reffDepth()}`, () =>
  $fetch('/api/dts/navigation', {
    body: { id: props.urn, level: reffDepth() },
    method: 'POST'
  })
)
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
  usedReff = validReffs[0]
}
ancestors.value.push({ id: props.urn, title: docTitle, disabled: true, ref: usedReff })

const currentIndex = validReffs.findIndex((m) => m === usedReff)
const prevId = currentIndex > 0 ? validReffs[currentIndex - 1] : null
const nextId = currentIndex + 1 < validReffs.length ? validReffs[currentIndex + 1] : null

const xslPath = () => {
  switch (true) {
    case props.urn.includes('commentary'):
      return 'assets/source/commentary.sef.json'
    case props.urn.includes('tlg0031'):
    case props.urn.includes('tlg0527'):
    case props.urn.includes('1henoch'):
      return 'assets/source/nt_fragment.sef.json'
    case props.urn.includes('qumran'):
      return 'assets/source/qumran.sef.json'
    default:
      return 'assets/source/epidoc.sef.json'
  }
}
const { data: formattedText } = useAsyncData(`document${props.urn}ref${usedReff}`, () =>
  $fetch('/api/dts/document', {
    body: { id: props.urn, ref: usedReff, xsl: xslPath() },
    method: 'POST'
  })
)
allAncestors.value.push(ancestors.value)
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
      <v-col :cols="props.urn.includes('qumran') ? 8 : 12">
        <v-container>
          <v-row v-if="alertText">
            <v-alert closable density="compact" type="warning">{{ alertText }}</v-alert>
          </v-row>
          <v-row justify="center">
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
          <v-row v-if="formattedText" justify="space-between">
            <v-col>
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
            <v-col>
              <v-menu v-if="siblings.length > 0" width="10rem">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" size="x-small" v-bind="props">
                    {{ $t('comptext.readIn') }}
                  </v-btn>
                </template>
                <v-list density="compact" :lines="false">
                  <v-list-item v-for="(sibling, index) in siblings" :key="index" :value="index">
                    <NuxtLink
                      :to="`/texts/${props.urn};${props.reff}/${sibling[0]};${props.reff}`"
                      >{{ sibling[1] }}</NuxtLink
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col>
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
