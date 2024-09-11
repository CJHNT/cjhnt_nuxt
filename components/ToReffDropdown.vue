<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const compProps = defineProps({
  currentReff: String,
  allReffs: Array,
  reffName: String,
  textUrn: String
})
const dropdownMembers = computed(() => {
  return compProps.allReffs.filter((i) => i !== compProps.currentReff)
})
const slugParts = route.params.slug
const toReplace = slugParts.indexOf(compProps.textUrn + ';' + compProps.currentReff)
function makeNewUrl(n) {
  return slugParts.toSpliced(toReplace, 1, compProps.textUrn + ';' + n).join('/')
}
</script>

<template>
  <v-menu v-if="dropdownMembers.length > 0" width="10rem">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" size="x-small" v-bind="props">
        {{ $t('comptext.goTo') }}
      </v-btn>
    </template>
    <v-list density="compact" :lines="false">
      <v-list-item v-for="(member, index) in dropdownMembers" :key="index" :value="index">
        <NuxtLink :to="`/texts/${makeNewUrl(member)}`">{{ member }}</NuxtLink>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
