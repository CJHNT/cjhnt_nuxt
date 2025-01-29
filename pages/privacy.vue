<template>
  <v-main class="d-flex">
    <v-container>
      <v-row justify="center">
        <v-col xl="6">
          <div class="text-h4 text-center">{{ $t('privacy.pageHeader') }}</div>
          <div class="text-h5">{{ $t('privacy.logFilesHeader') }}</div>
          <div class="text-body-2">{{ $t('privacy.logFilesP1') }}</div>
          <div class="text-body-2">{{ $t('privacy.logFilesP2') }}</div>
          <div class="text-h5">{{ $t('privacy.cookiesHeader') }}</div>
          <div class="text-body-2">{{ $t('privacy.cookiesP1') }}</div>
          <div class="text-body-2">{{ $t('privacy.cookiesP2') }}</div>
          <div class="text-h5">{{ $t('privacy.userTrackingHeader') }}</div>
          <div class="text-body-2">{{ $t('privacy.userTrackingP1') }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
