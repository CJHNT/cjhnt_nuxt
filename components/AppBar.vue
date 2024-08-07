<script setup>
const { loggedIn, user, clear, fetch } = useUserSession()
const router = useRouter()

fetch()
const logout = () => {
  clear()
  router.push({ name: 'index' })
}
</script>

<template>
  <v-app-bar color="#027f42">
    <template v-slot:prepend>
      <v-btn
        href="https://www.theol.uni-leipzig.de/institut-fuer-neutestamentliche-wissenschaft/forschung/corpus-judaeo-hellenisticum-novi-testamenti-digital"
        target="_blank"
        class="d-md-none"
        ><v-img
          src="@/assets/img/cjh-logo-quadratisch-klein.png"
          alt="Logo: CJHNT Project"
          width="32"
          inline
        ></v-img
      ></v-btn>
      <v-btn icon="mdi-home" href="/"></v-btn>
    </template>
    <template v-slot:append>
      <v-btn icon="mdi-magnify"></v-btn>
      <template v-if="loggedIn">
        <v-tooltip location="bottom" :text="`Logged in as ${user.email}`">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account" to="/auth/dashboard" v-bind="props"></v-btn>
            <v-btn icon="mdi-logout" @click="logout" v-bind="props"></v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-btn v-else icon="mdi-login" to="/auth/login"></v-btn>
      <LangSwitcher />
    </template>
  </v-app-bar>
</template>
