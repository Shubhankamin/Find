<template>
  <div
    class="d-flex flex-column align-center justify-center"
    style="min-height: 100vh"
  >
    <v-card class="pa-6" width="400">
      <h2 class="text-center mb-4">Forgot Password</h2>

      <v-text-field
        v-model="email"
        placeholder="Enter your email"
        type="email"
        variant="outlined"
        prepend-icon="mdi-email"
      ></v-text-field>

      <v-btn
        class="mt-4"
        color="primary"
        block
        :loading="loading"
        @click="handleForgotPassword"
      >
        Send Reset Link
      </v-btn>

      <div v-if="auth.error" class="text-error mt-3 text-center">
        {{ auth.error }}
      </div>

      <v-divider class="my-4"></v-divider>
      <div class="text-center">
        <NuxtLink to="/login" style="text-decoration: none" class="text-black"
          >Back to Login</NuxtLink
        >
      </div>
    </v-card>

    <!-- ✅ Snackbar for success -->
    <v-snackbar v-model="showSnackbar" color="green" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/auth";

const email = ref("");
const loading = ref(false);
const showSnackbar = ref(false);
const snackbarMessage = ref("");

const auth = useAuth();

const handleForgotPassword = async () => {
  if (!email.value) {
    auth.error.value = "Please enter your email.";
    return;
  }
  loading.value = true;

  try {
    const res = await auth.forgotPassword(email.value);

    // ✅ If API call successful, show snackbar
    if (res?.status === 200 || !auth.error.value) {
      snackbarMessage.value = "Password reset link sent successfully!";
      showSnackbar.value = true;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
