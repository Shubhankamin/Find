<template>
  <v-container class="text-center">
    <v-row class="justify-center mb-5">
      <v-col cols="8" sm="4" md="2">
        <v-img src="/images/logo-2.png"></v-img>
      </v-col>
    </v-row>
    <div class="">
      <v-icon size="64" color="primary" >mdi-email-check</v-icon>

      <p class="my-5 bebas-Bold-h4">Please verify your email</p>

      <p class="mb-2 ">
        A verification link has been sent to
        <strong>{{ email }}</strong>
      </p>

      <p class="mb-5">You must verify your email before logging in.</p>

      <v-btn color="primary" @click="goToLogin"> Go to Login </v-btn>
    </div>
  </v-container>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const email = route.query.email as string;

const goToLogin = () => {
  router.push("/login");
};
</script>
