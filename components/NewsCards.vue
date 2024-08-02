<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 24 : 4"
      class="mx-auto px-6 pb-6 pt-3 news-card"
    >
      <v-card-title class="news-title text-wrap font-weight-black text-subtitle-1"
        >Das CJHNT digital Projekt ist gestartet</v-card-title
      >
      <v-card-text class="news-snippet"
        >Am 01. April 2024 haben wir das Projekt mit der Einstellung der ersten Mitarbeiterinnen und
        Mitarbeiter beginnen können.
      </v-card-text>
      <v-card-text class="py-0"
        ><a
          href="https://www.theol.uni-leipzig.de/institut-fuer-alttestamentliche-wissenschaft/newsdetail-1/artikel/das-cjhnt-digital-projekt-ist-gestartet-2024-04-02"
          target="_blank"
          >Read more</a
        ></v-card-text
      >
    </v-card>
  </v-hover>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 24 : 4"
      class="mx-auto px-6 pb-6 pt-3 news-card"
    >
      <v-card-title class="news-title text-wrap font-weight-black text-subtitle-1"
        >Check out our new platform</v-card-title
      >
      <v-card-text class="news-snippet"
        >We've updated our styling. Take a tour and let us know what you think.
      </v-card-text>
      <v-card-text class="py-0"
        ><a
          href="https://www.theol.uni-leipzig.de/institut-fuer-alttestamentliche-wissenschaft/newsdetail-1/artikel/das-cjhnt-digital-projekt-ist-gestartet-2024-04-02"
          target="_blank"
          >Read more</a
        ></v-card-text
      >
    </v-card>
  </v-hover>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 24 : 4"
      class="mx-auto px-6 pb-6 pt-3 news-card"
    >
      <v-card-title class="news-title text-wrap font-weight-black text-subtitle-1"
        >New texts are coming</v-card-title
      >
      <v-card-text class="news-snippet"
        >We will soon be flooding our platform with early Jewish texts and our first commentaries.
        Sign up for an account to be kept abreast of the latest developments.
      </v-card-text>
      <v-card-text class="py-0"
        ><nuxt-link :to="{ name: 'auth-register' }">Sign up</nuxt-link></v-card-text
      >
    </v-card>
  </v-hover>
</template>

<style scoped>
.news-card:hover,
.news-card:focus {
  z-index: 1000;
}
.news-title {
  padding-top: 0;
}
.news-snippet {
  height: 76px;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
  padding-bottom: 0px;
}
.news-card {
  margin-bottom: -80px;
}

.news-snippet::after {
  content: '';
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 70%;
  height: 1.2em;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%);
}
</style>
