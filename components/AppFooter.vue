<script setup>
const props = defineProps({ border: { type: String, default: '' } })
</script>

<template>
  <v-footer class="d-flex flex-column" :app="true" :border="props.border">
    <v-container class="pa-0">
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <a href="https://www.akademienunion.de/forschungsprojekte/" target="_blank">
            <v-row>
              <v-col cols="auto">
                <picture>
                  <source
                    media="(max-width: 600px)"
                    srcset="@/assets/img/logo_akademieunion_farbig_transparent.png"
                    height="20"
                    width="60"
                  >
                  <source
                    media="(max-width: 960px)"
                    srcset="@/assets/img/logo_akademieunion_farbig_transparent.png"
                    height="30"
                    width="90"
                  >
                  <source
                    media="(max-width: 1280px)"
                    srcset="@/assets/img/logo_akademieunion_farbig_transparent.png"
                    height="40"
                    width="120"
                  >
                  <source
                    media="(max-width: 1920px)"
                    srcset="@/assets/img/logo_akademieunion_farbig_transparent.png"
                    height="50"
                    width="150"
                  >
                  <source
                    media="(max-width: 2560px)"
                    srcset="@/assets/img/logo_akademieunion_farbig_transparent.png"
                    height="60"
                    width="180"
                  >
                  <img
                    src="@/assets/img/logo_akademieunion_farbig_transparent.png"
                    alt="Logo: Akademienunion"
                    height="70"
                    width="210"
                  >
                </picture>
              </v-col>
              <v-col cols="auto">
                <picture>
                  <source
                    media="(max-width: 600px)"
                    srcset="@/assets/img/sachsen-signet_gruen.png"
                    height="20"
                    width="14"
                  >
                  <source
                    media="(max-width: 960px)"
                    srcset="@/assets/img/sachsen-signet_gruen.png"
                    height="30"
                    width="21"
                  >
                  <source
                    media="(max-width: 1280px)"
                    srcset="@/assets/img/sachsen-signet_gruen.png"
                    height="40"
                    width="28"
                  >
                  <source
                    media="(max-width: 1920px)"
                    srcset="@/assets/img/sachsen-signet_gruen.png"
                    height="50"
                    width="35"
                  >
                  <source
                    media="(max-width: 2560px)"
                    srcset="@/assets/img/sachsen-signet_gruen.png"
                    height="60"
                    width="42"
                  >
                  <img
                    src="@/assets/img/sachsen-signet_gruen.png"
                    alt="Logo: Akademienunion"
                    height="70"
                    width="47"
                  >
                </picture>
              </v-col>
              <v-tooltip activator="parent" location="top"
                >Dieses Forschungsvorhaben ist Teil im Akademienprogramm, das als derzeit größtes
                geistes- und kulturwissenschaftliches Langfrist-Forschungsprogramm der
                Bundesrepublik Deutschland von Bund und Ländern getragen wird. Diese Maßnahme wird
                mitfinanziert durch Steuermittel auf der Grundlage des vom Sächsischen Landtag
                beschlossenen Haushalts.</v-tooltip
              >
            </v-row>
          </a>
        </v-col>
      </v-row>
    </v-container>
    <div />
  </v-footer>
</template>

<style scoped>
.text-caption.footer-text {
  line-height: normal;
}
</style>

<style>
.v-tooltip__content {
  pointer-events: initial;
}
</style>
