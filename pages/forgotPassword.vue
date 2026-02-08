<template>
  <v-container fluid class="login-container">
    <!-- Logo -->
    <v-row class="justify-center align-center">
      <v-col cols="8" sm="4" md="2">
        <v-img src="/images/logo-2.png"></v-img>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col class="d-flex align-center justify-center px-5" cols="12">
        <v-card
          class="login-card pa-6 pa-sm-8 pa-md-10"
          :max-width="450"
          elevation="10"
        >
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-h5 text-md-h4 font-weight-bold mb-2">
              Forgot Password
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              Enter your MIT student email to receive a reset link
            </p>
          </div>

          <!-- FORM -->
          <v-form ref="formRef" v-model="isFormValid" validate-on="input">
            <v-text-field
              v-model="email"
              placeholder="Enter your MIT email"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
              class="rounded-input"
              density="compact"
              :rules="[rules.required, rules.emailFormat]"
            />

            <v-btn
              class="mt-4 rounded-pill text-white"
              color="primary"
              block
              size="large"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleForgotPassword"
            >
              Send Reset Link
            </v-btn>
          </v-form>

          <v-divider class="my-6"></v-divider>

          <div class="text-center">
            <v-btn
              variant="text"
              class="text-primary"
              @click="router.push('/login')"
            >
              Back to Login
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSnackbar" color="green" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="red" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/auth";

const auth = useAuth();
const router= useRouter();
const email = ref("");
const loading = ref(false);

const showSnackbar = ref(false);
const snackbarMessage = ref("");

const showError = ref(false);
const errorMessage = ref("");

const formRef = ref(null);
const isFormValid = ref(false);

// SAME STUDENT EMAIL RULE
const studentEmailRegex =
  /^[a-zA-Z0-9._%+-]+\.mitmpl\d{4}@learner\.manipal\.edu$/;

const rules = {
  required: (v: string) => !!v || "Email is required",
  emailFormat: (v: string) =>
    studentEmailRegex.test(v) ||
    "Enter valid MIT student email (name.mitmplYYYY@learner.manipal.edu)",
};

const handleForgotPassword = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const res = await auth.forgotPassword(email.value.trim());

    if (res) {
      snackbarMessage.value = "Password reset link sent to your email";
      showSnackbar.value = true;
      email.value = "";
    }
  } catch (err: any) {
    errorMessage.value =
      err?.message || "Unable to send reset link. Try again later.";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
