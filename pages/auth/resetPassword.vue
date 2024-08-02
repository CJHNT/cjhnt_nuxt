<script setup></script>

<template>
  <v-main>
    <v-card width="400" class="mx-auto mt-5">
      <v-alert v-if="alertMessage.message" :type="alertMessage.type" closable>{{
        alertMessage.message
      }}</v-alert>
      <template v-if="accountEmail">
        <v-card-title class="pb-0">
          <h1>Reset Password</h1>
        </v-card-title>
        <v-card-subtitle>{{ accountEmail }}</v-card-subtitle>
        <v-card-text>
          <v-form>
            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              v-model="newPassword"
            />
            <v-text-field
              :type="showRepeatPassword ? 'text' : 'password'"
              label="Repeast password"
              prepend-icon="mdi-lock"
              :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showRepeatPassword = !showRepeatPassword"
              v-model="newRepeatPassword"
            />
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="resetFirebasePassword" color="info">Reset Password</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-main>
</template>
