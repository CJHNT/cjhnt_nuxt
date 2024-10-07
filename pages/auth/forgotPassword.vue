<script setup></script>

<template>
  <v-main>
    <v-card width="400" class="mx-auto mt-5">
      <v-alert v-if="alertMessage.message" closable density="compact" :type="alertMessage.type">{{
        alertMessage.message
      }}</v-alert>
      <v-alert v-if="user" type="success" closable
        >You are logged in as {{ user.displayName ? user.displayName : user.email }}</v-alert
      >
      <template v-else>
        <v-card-title class="pb-0">
          <h1>Forgot your</h1>
          <h1>password?</h1>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="email" label="Email" prepend-icon="mdi-email" />
          </v-form>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-btn color="info" @click="resetPassword">Reset password</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-main>
</template>
