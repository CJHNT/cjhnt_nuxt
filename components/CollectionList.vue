<script setup>
const props = defineProps({
  sortedMembers: {
    type: Array,
    required: true,
    default: []
  }
})
const { locale } = useI18n()
const { name } = useDisplay()
const colLists = ref([])

const numCols = computed(() => {
  colLists.value = []
  let colLength = 0
  switch (name.value) {
    case 'xs':
      colLists.value.push(props.sortedMembers)
      return 1
    case 'sm':
    case 'md':
      colLength = Math.ceil(props.sortedMembers.length / 3)
      for (let i = 0; i < 3; i++) {
        colLists.value.push(props.sortedMembers.slice(i * colLength, (i + 1) * colLength))
      }
      return 3
    case 'lg':
    case 'xl':
    case 'xxl':
      colLength = Math.ceil(props.sortedMembers.length / 4)
      for (let i = 0; i < 4; i++) {
        colLists.value.push(props.sortedMembers.slice(i * colLength, (i + 1) * colLength))
      }
      return 4
    default:
      colLists.value.push(props.sortedMembers)
      return 1
  }

  colLists.value.push(props.sortedMembers)
  return 1
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="x in numCols">
        <v-list :lines="false">
          <v-list-item
            v-for="member in colLists[x - 1]"
            :key="member.id"
            class="pa-0"
            :id="member.id"
          >
            <template v-if="member.versions">
              <v-list-item-title>{{ member[locale] }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-btn
                  v-for="version in member.versions"
                  :to="`/texts/${version[0]};${member.firstChild}`"
                  variant="plain"
                  density="compact"
                  >{{ version[1] }}</v-btn
                >
              </v-list-item-subtitle>
            </template>
            <template v-else>
              <v-list-item-title>
                <nuxt-link :to="`/texts/${member.id}`">{{
                  member[locale].split(' ')[0]
                }}</nuxt-link></v-list-item-title
              >
              <v-list-item-subtitle>{{
                member[locale].split(' ').slice(1).join(' ')
              }}</v-list-item-subtitle>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
