<script setup>
import { allows } from 'nuxt-authorization/utils'
import { readClosed } from '~/utils/abilities'
import parentsAndSiblings from '~/utils/parentsAndSiblings'

const { locale } = useI18n()
const { user } = useUserSession()
const projectMember = await allows(readClosed, user.value)
const hitWords = useState('hitWords')
const linguisticShown = ref({ lemma: false, phonetic: false, 'phonetic-lemma': false })
const linguisticExist = ref({ lemma: false, phonetic: false, 'phonetic-lemma': false })

const props = defineProps({
  urn: { type: String, default: '' },
  reff: { type: String, default: '1' }
})
const allAncestors = defineModel({ type: Array, default: [] })
const ancestors = ref([])
const notificationStore = useNotificationStore()
const reffDepth = () => {
  const reffSections = props.reff.split('-')[0].match(/\./g)
  if (reffSections) {
    return reffSections.length + 1
  }
  return 1
}
const { data: docMeta } = await useAsyncData(props.urn + props.reff, () =>
  $fetch('/api/dts/collections', {
    body: { id: props.urn },
    method: 'POST'
  })
)
const openText =
  docMeta.value['dts:dublincore'] && docMeta.value['dts:dublincore']['dct:accessRights'] === 'open'
const docTitle = {
  de:
    docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.['@value'] ??
    docMeta.value.title,
  en:
    docMeta.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.['@value'] ??
    docMeta.value.title
}
let parentId = props.urn.split('.').slice(0, -1).join('.')
if (docMeta.value['dts:dublincore']?.['dct:isPartOf']) {
  if (typeof docMeta.value['dts:dublincore']['dct:isPartOf'] === 'string') {
    parentId = docMeta.value['dts:dublincore']['dct:isPartOf']
  } else if (Array.isArray(docMeta.value['dts:dublincore']['dct:isPartOf'])) {
    parentId = docMeta.value['dts:dublincore']['dct:isPartOf'][0]['@id']
  }
}
const { textAncestors, collMembers } = await parentsAndSiblings(parentId)
ancestors.value = [...textAncestors].filter((c) => c.id !== parentId)
const siblings = collMembers
  .filter((c) => c['@id'] !== props.urn)
  .map((m) => {
    const biblio = {
      de:
        m['dts:dublincore']['dct:bibliographicCitation']?.find((e) => e['@language'] === 'deu')?.[
          '@value'
        ] ?? m['dts:extensions']['dc:language'][0]['@value'],
      en:
        m['dts:dublincore']['dct:bibliographicCitation']?.find((e) => e['@language'] === 'eng')?.[
          '@value'
        ] ?? m['dts:extensions']['dc:language'][0]['@value']
    }
    return [
      m['@id'],
      m['dts:extensions']['dc:language'],
      m['dts:dublincore']?.['dct:accessRights'] === 'open',
      biblio
    ]
  })
  .filter((c) => projectMember || c[2])
const alertText = ref('')
const prevId = ref(null)
const nextId = ref(null)
const formattedText = ref('')
const navReturn = ref(null)
const usedReff = ref(props.reff)
const validReffs = ref([])
if (openText || projectMember) {
  const { data: navInfo } = await useAsyncData(`${props.urn}level${reffDepth()}`, () =>
    $fetch('/api/dts/navigation', {
      body: { id: props.urn, level: reffDepth() },
      method: 'POST'
    })
  )
  navReturn.value = navInfo.value
  validReffs.value = navReturn.value['hydra:member'].map((r) => r.ref)
  if (!props.reff.split('-').every((e) => validReffs.value.includes(e))) {
    await useAsyncData('refWarning', () =>
      notificationStore
        .addNotification({
          type: 'warning',
          // rule disabled because locale is not user-provided input

          message: `Reference ${usedReff.value} not found in ${docTitle[locale]}. Returning the text's first ${navReturn.value.citeType} (${validReffs.value[0]}).`
        })
        .then(() => true)
    )
    usedReff.value = validReffs.value[0]
  }
  ancestors.value.push({ id: props.urn, title: docTitle, disabled: true, ref: usedReff.value })

  const currentIndex = validReffs.value.findIndex((m) => m === usedReff.value)
  prevId.value = currentIndex > 0 ? validReffs.value[currentIndex - 1] : null
  nextId.value =
    currentIndex + 1 < validReffs.value.length ? validReffs.value[currentIndex + 1] : null

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
  const { data } = await useAsyncData(`document${props.urn}ref${usedReff.value}`, () =>
    $fetch('/api/dts/document', {
      body: { id: props.urn, ref: usedReff.value, xsl: xslPath() },
      method: 'POST'
    })
  )
  formattedText.value = data.value
  const parser = new DOMParser()
  const domText = parser.parseFromString(formattedText.value, 'text/html')
  for (const ling in linguisticExist.value) {
    if (domText.querySelector(`span.${ling}`)) {
      linguisticExist.value[ling] = true
    }
  }
  if (hitWords.value) {
    const parser = new DOMParser()
    const domText = parser.parseFromString(formattedText.value, 'text/html')
    hitWords.value.forEach((index) => {
      const hitWord = domText.querySelector(`[n="w-${index}"]`)
      hitWord.classList.add('searchHit')
    })
    formattedText.value = domText.documentElement.outerHTML
    hitWords.value = null
  }
}
allAncestors.value.push(ancestors.value)
onUnmounted(() => {
  notificationStore.$reset()
})
const toggleLinguistic = (lingType) => {
  linguisticShown.value[lingType] = !linguisticShown.value[lingType]
  document.querySelectorAll(`.${lingType}`).forEach((e) => {
    if (linguisticShown.value[lingType]) {
      e.classList.remove('d-none')
      e.parentElement.classList.add('px-1')
      e.parentElement.addEventListener('animationend', () =>
        e.parentElement.classList.remove('flash-yellow')
      )
      e.parentElement.classList.add('flash-yellow')
      e.parentElement.classList.add('border')
    } else {
      e.classList.add('d-none')
      if (Object.values(linguisticShown.value).every((v) => v === false)) {
        e.parentElement.classList.remove('border')
        e.parentElement.classList.remove('px-1')
      }
    }
  })
}
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
                <template #activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" variant="plain" size="x-small"
                    ><v-icon> mdi-copyright </v-icon></v-btn
                  >
                </template>

                <template #default="{ isActive }">
                  <v-card title="Copyright">
                    <v-card-text>
                      {{ docMeta['dts:extensions']['dc:rights'] }}
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer />

                      <v-btn :text="$t('closeDialog')" @click="isActive.value = false" />
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row v-if="navReturn" justify="space-between">
            <v-col>
              <NuxtLink v-show="prevId !== null" :to="`/texts/${props.urn};${prevId}`">{{
                $t('comptext.previous')
              }}</NuxtLink>
            </v-col>
            <v-col>
              <ToReffDropdown
                :current-reff="usedReff"
                :all-reffs="validReffs"
                :reff-name="navReturn.citeType"
                :text-urn="props.urn"
              />
            </v-col>
            <template v-for="(v, k) in linguisticShown" :key="k">
              <v-col v-if="linguisticExist[k]">
                <v-btn variant="text" size="x-small" @click="toggleLinguistic(k)">{{
                  $t(`comptext.${k}${v}`)
                }}</v-btn>
              </v-col>
            </template>
            <v-col>
              <v-menu v-if="siblings.length > 0">
                <template #activator="{ props: siblingProps }">
                  <v-btn variant="text" size="x-small" v-bind="siblingProps">
                    {{ $t('comptext.readIn') }}
                  </v-btn>
                </template>
                <v-list density="compact" :lines="false">
                  <v-list-item
                    v-for="(sibling, index) in siblings"
                    :key="index"
                    :value="index"
                    class="text-truncate"
                  >
                    <NuxtLink :to="`/texts/${props.urn};${props.reff}/${sibling[0]};${props.reff}`"
                      >[{{ sibling[1] }}] {{ sibling[3][locale] }}</NuxtLink
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col>
              <NuxtLink v-show="nextId !== null" :to="`/texts/${props.urn};${nextId}`">{{
                $t('comptext.next')
              }}</NuxtLink>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="text-content">
          <v-row>
            <v-col>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="formattedText" v-html="formattedText" />
              <v-alert v-else-if="siblings" type="warning"
                >{{ $t('comptext.onlyProject') }} {{ $t('comptext.onlyProjectSiblings') }}
                <nuxt-link
                  v-for="(sibling, index) in siblings"
                  :key="index"
                  :to="`/texts/${sibling[0]};${props.reff}`"
                  >{{ sibling[3][locale] }},
                </nuxt-link></v-alert
              >
              <v-alert v-else type="warning">{{ $t('comptext.onlyProject') }}</v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.searchHit {
  font-weight: bold;
}
.stack {
  display: inline-flex;
  flex-direction: column;
}
.stack span {
  font-size: smaller;
}
</style>
