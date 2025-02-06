<script setup>
definePageMeta({
  middleware: ['project-auth']
})
const authorized = useState('authorized')
// const notificationStore = useNotificationStore()

// if (!loggedIn.value) {
//   await useAsyncData('authWarning', async () => {
//     notificationStore.addNotification({
//       type: 'warning',
//       message: '',
//       i18n: 'auth.onlyRegistered',
//       link: '/auth/login',
//       linkMessage: 'auth.login'
//     })
//   })
// }
useHead({
  script: [{ src: '/textPage.js', tagPosition: 'bodyClose', defer: true }]
})
const route = useRoute()
const urnReffs = route.params.slug.map((urnReff) => {
  const urnParts = urnReff.split(';')
  let reff = '1'
  if (urnParts.length === 2) {
    reff = urnParts[1]
  }
  return [urnParts[0], reff]
})
const allAncestors = ref([])
</script>

<template>
  <v-responsive>
    <AppFooter />
    <v-main class="d-flex justify-center" min-height="300px">
      <!-- <v-container v-if="!loggedIn" class="text-column">
        <v-alert type="warning"
          >{{ $t('auth.onlyProject') }} <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
        >
      </v-container> -->
      <NotificationContainer />

      <v-container v-if="authorized">
        <NotificationContainer />
        <v-row justify="center">
          <v-col
            v-for="(urnReff, index) in urnReffs"
            :id="urnReff.join(';')"
            :key="urnReff.join(';')"
            cols="12"
            :xl="urnReff[0].includes('commentary') || urnReff[0].includes('qumran') ? 6 : 4"
            class="text-column"
          >
            <CommentaryColumn
              v-if="urnReff[0].includes('commentary')"
              v-model="allAncestors"
              :urn="urnReff[0]"
              :reff="urnReff[1]"
              :index="index"
            />
            <InfoColumn
              v-else-if="urnReff[0].includes('cjhnt:info')"
              v-model="allAncestors"
              :urn="urnReff[0]"
              :reff="urnReff[1]"
            />
            <TextColumn
              v-else
              v-model="allAncestors"
              :urn="urnReff[0]"
              :reff="urnReff[1]"
              :index="index"
            />
          </v-col>
          <v-col
            v-for="(ancestors, index) in allAncestors"
            :key="index"
            cols="12"
            :xl="urnReffs.length > 1 ? 10 : 9"
            :offset-xl="urnReffs.length > 1 ? 0 : 3"
            order="first"
            class="py-0"
          >
            <BreadCrumb :ancestors="ancestors" :index="index" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-responsive>
</template>

<style scoped>
.text-column {
  padding-right: calc(var(--section-gap) / 2);
  padding-left: calc(var(--section-gap) / 2);
  max-width: 1200px;
  /* height: 80vh; */
}
.dropbtn:hover,
.dropbtn:focus {
  background-color: var(--color-text);
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--color-background-mute);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown-content a {
  display: block;
}
.show {
  display: block;
}
</style>

<style>
.cit-string {
  vertical-align: super;
  font-size: small;
}
.section-d-dropdown-content,
.section-b-dropdown-content {
  transition: all 0.4s linear;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
}

div.texteinleitung p,
div.cjh-Zitaterläuterung p {
  font-size: smaller;
}

.text-content {
  overflow-y: auto;
  height: 68vh;
}

.space-before::before {
  content: ' ';
}

.space-after::after {
  content: ' ';
}

@keyframes note-focus {
  from {
    background-color: lightgrey;
  }
  to {
    background-color: initial;
  }
}

.flash-yellow {
  animation-name: note-focus;
  animation-duration: 5s;
}

.cjh-Autorennamen {
  font-variant: small-caps;
}

.section-subtitle {
  font-weight: bold;
  text-align: center;
}

.subsection-subtitle {
  font-style: italic;
  font-weight: bold;
  text-align: center;
}

.minor-heading {
  font-variant: small-caps;
  text-align: center;
}

.text-line {
  margin-left: 20px;
}

li::marker {
  content: '';
}

li:hover::marker,
li:nth-child(5n)::marker {
  content: attr(value) '  ';
  font-size: x-small;
}
</style>
