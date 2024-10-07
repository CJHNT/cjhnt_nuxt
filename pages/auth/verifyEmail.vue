<script setup></script>

<template>
  <v-main>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>Verify Your Email</h1>
      </v-card-title>
      <v-card-text>
        You should have received an email to verify your email address at {{ user.email }}. If not,
        click the link below to resend the email.
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-btn color="info" @click="verifyEmail">Verify Email</v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>
