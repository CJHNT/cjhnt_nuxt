<script setup>
const props = defineProps({
  sortedMembers: {
    type: Array,
    required: true
  }
})
const { user } = useUserSession()
const { locale } = useI18n()
const { name } = useDisplay()
const colLists = ref([])
const numCols = ref(4)
const projectMember = await allows(readClosed, user.value)

watch(
  name,
  (newName) => {
    colLists.value = []
    let colLength = 0
    switch (newName) {
      case 'xs':
        colLists.value.push(props.sortedMembers)
        numCols.value = 1
        break
      case 'sm':
      case 'md':
        colLength = Math.ceil(props.sortedMembers.length / 3)
        for (let i = 0; i < 3; i++) {
          colLists.value.push(props.sortedMembers.slice(i * colLength, (i + 1) * colLength))
        }
        numCols.value = 3
        break
      case 'lg':
      case 'xl':
      case 'xxl':
        colLength = Math.ceil(props.sortedMembers.length / 4)
        for (let i = 0; i < 4; i++) {
          colLists.value.push(props.sortedMembers.slice(i * colLength, (i + 1) * colLength))
        }
        numCols.value = 4
        break
      default:
        colLists.value.push(props.sortedMembers)
        numCols.value = 1
    }
  },
  { immediate: true }
)
const openVersions = (text) => {
  return projectMember || text.versions.some((v) => v[2] === 'open')
}
const showList = (c) => {
  if (projectMember) {
    return true
  } else if (c.id.includes('commentary')) {
    return c.subCollections.some((v) => v.openText === 'open')
  }
  return true
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(x, index) in numCols" :key="index">
        <v-list :lines="false">
          <v-list-item
            v-for="subGroup in colLists[x - 1]"
            :id="subGroup.id"
            :key="subGroup.id"
            class="pa-0"
          >
            <template v-if="showList(subGroup)">
              <h2 v-if="subGroup.title" class="font-weight-bold pb-2">
                {{ $t(subGroup.title, { chapter: subGroup.chapter }) }}
              </h2>
              <template v-for="(member, memberIndex) in subGroup.subCollections" :key="memberIndex">
                <template v-if="member.versions.some((v) => v.length === 4)">
                  <v-list-item-title>{{ member[locale] }}</v-list-item-title>
                  <v-list-item-subtitle v-if="openVersions(member)">
                    <template
                      v-for="(version, versionIndex) in member.versions"
                      :key="versionIndex"
                    >
                      <v-btn
                        v-if="projectMember || version[2] === 'open'"
                        :to="`/texts/${version[0]};${member.firstChild}`"
                        variant="plain"
                        density="compact"
                        >{{ version[1] }}
                        <v-tooltip v-if="version[3]" activator="parent" location="bottom">
                          {{ version[3] }}
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>{{
                    $t('comptext.onlyProject')
                  }}</v-list-item-subtitle>
                </template>
                <template v-else-if="member.id.includes('info')">
                  <v-list-item-title>
                    <nuxt-link :to="`/texts/${member.id}`">{{
                      member[locale]
                    }}</nuxt-link></v-list-item-title
                  >
                </template>
                <template v-else>
                  <template v-if="projectMember || member.openText === 'open'">
                    <v-list-item-title>
                      <nuxt-link :to="`/texts/${member.id}`">{{
                        member[locale].split(' ')[0]
                      }}</nuxt-link></v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      member[locale].split(' ').slice(1).join(' ')
                    }}</v-list-item-subtitle>
                  </template>
                </template>
              </template>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
