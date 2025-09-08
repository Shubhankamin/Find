<template>
  <v-container fluid class="login-container">
    <v-row class="justify-center align-center">
      <v-col cols="8" sm="4" md="2">
        <v-img src="/images/logo-2.png"></v-img>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col class="d-flex align-center justify-center" cols="12">
        <v-card
          class="login-card pa-6 pa-sm-8 pa-md-10"
          :max-width="450"
          elevation="10"
        >
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-h5 text-md-h4 font-weight-bold mb-2">Log In</h1>
            <p class="text-body-2 text-medium-emphasis">
              Access your Lost & Found account
            </p>
          </div>

          <!-- Form -->
          <v-form>
            <v-text-field
              placeholder="Enter your email"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
              class="mb-4 rounded-input"
              v-model="email"
            />

            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              variant="outlined"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              class="rounded-input"
              v-model="password"
            />

            <!-- Remember & Forgot -->
            <div class="d-flex justify-end align-center mb-4 flex-wrap">
              <!-- <v-checkbox
            label="Remember me"
            hide-details
            density="compact"
            v-model="remember"
          /> -->
              <v-btn
                variant="text"
                size="small"
                class="text-primary"
                @click="goToForgot"
              >
                Forgot password?
              </v-btn>
            </div>

            <v-btn
              block
              color="primary"
              size="large"
              class="rounded-pill text-white mb-6"
              @click="handleLogin"
            >
              Log In
            </v-btn>

            <div class="divider mb-6">
              <span>OR</span>
            </div>

            <p class="text-center text-body-2 mt-6">
              Don't have an account?
              <v-btn
                variant="text"
                size="small"
                class="text-primary"
                @click="gotToSignup"
              >
                Create one
              </v-btn>
            </p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/auth";

const email = ref("");
const password = ref("");
const remember = ref(false);
const router = useRouter();
const cookies = useCookie("login");
const showPassword = ref(false);

const goToForgot = () => {
  router.push("/forgotPassword");
};
const { login, error, currentUser } = useAuth();

const gotToSignup = () => {
  router.push("/signup");
};

const snackbar = ref({
  show: false,
  message: "",
  color: "red",
});

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      snackbar.value = {
        show: true,
        message: "Please fill in both fields",
        color: "red",
      };
      return;
    }

    const user = await login(email.value, password.value);
    console.log("Login successful:", user);

    cookies.value = JSON.stringify(user);

    snackbar.value = {
      show: true,
      message: "Login successful",
      color: "green",
    };

    // ✅ Correct navigation for Nuxt 3
    await navigateTo("/");
  } catch (err) {
    console.error("Login error:", err);

    const errorMessage =
      err?.error?.message || err?.message || "Login failed. Please try again.";

    snackbar.value = {
      show: true,
      message: errorMessage,
      color: "red",
    };
  }
};

onMounted(() => {
  const localUser = localStorage.getItem("user");
  const cookieUser = cookies.value;
  console.log("Local Storage User:", localUser);
  console.log("Cookie User:", cookieUser);
});
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
  padding: 16px;
}

.login-card {
  border-radius: 20px;
  background: #fff;
  width: 100%;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #ddd;
  margin: 0 12px;
}

/* Make fonts and padding smaller on small screens */
@media (max-width: 600px) {
  .login-card {
    padding: 16px !important;
  }
  .text-h4 {
    font-size: 1.4rem !important;
  }
}
</style>
