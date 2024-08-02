<script setup>
import AuthForm from '@/components/AuthForm.vue'

const alertMessage = ref({ type: '', message: '' })
const { loggedIn, user, fetch } = useUserSession()

fetch()

const changePassword = () => {}
const changeEmail = () => {}
</script>

<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="4">
          <v-alert
            v-if="alertMessage.message"
            :type="alertMessage.type"
            :text="alertMessage.message"
            closable
          ></v-alert>
        </v-col>
      </v-row>
      <v-row justify="center">
        <template v-if="loggedIn">
          <p>Hello {{ user?.email }}</p>
          <v-col cols="auto">
            <AuthForm
              :loading="loading"
              @submit="changePassword"
              title="Change password"
              label="New password"
            />
          </v-col>
          <v-col cols="auto">
            <AuthForm
              :loading="loading"
              @submit="changeEmail"
              title="Change email"
              label="New email"
            />
          </v-col>
        </template>
        <template v-else>
          <p>Please <nuxt-link :to="{ name: 'auth-login' }">log in</nuxt-link> to view this page</p>
        </template>
      </v-row>
    </v-container>
  </v-main>
</template>
