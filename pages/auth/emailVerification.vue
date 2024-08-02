<script setup></script>

<template>
  <v-main>
    <v-card width="400" class="mx-auto mt-5">
      <v-alert :type="alertMessage === 'Verifying Email' ? 'info' : 'success'" closable>{{
        alertMessage
      }}</v-alert>
    </v-card>
  </v-main>
</template>
