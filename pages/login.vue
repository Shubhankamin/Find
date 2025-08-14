<template>
  <v-container fluid class="login-container d-flex align-center justify-center">
    <v-card class="login-card pa-10" max-width="400" elevation="10">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-h4 font-weight-bold mb-2">Sign In</h1>
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
          placeholder="Enter your password"
          type="password"
          variant="outlined"
          prepend-inner-icon="mdi-lock-outline"
          class="mb-4 rounded-input"
          v-model="password"
        />

        <!-- Remember & Forgot -->
        <div class="d-flex justify-space-between align-center mb-4">
          <v-checkbox
            label="Remember me"
            hide-details
            density="compact"
            v-model="remember"
          />
          <v-btn variant="text" size="small" class="text-primary">
            Forgot password?
          </v-btn>
        </div>

        <!-- Login Button -->
        <v-btn
          block
          color="primary"
          size="large"
          class="rounded-pill text-white mb-6"
          @click="handleLogin"
        >
          Sign In
        </v-btn>

        <!-- Divider -->
        <div class="divider mb-6">
          <span>OR</span>
        </div>

        <!-- Signup -->
        <p class="text-center text-body-2 mt-6">
          Don't have an account?
          <v-btn variant="text" size="small" class="text-primary">
            Create one
          </v-btn>
        </p>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/auth";
const email = ref("");
const password = ref("");
const remember = ref(false);

const { login, error, currentUser } = useAuth();

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      alert("Please fill in both fields");
      return;
    }

    const user = await login(email.value, password.value);
    console.log("Login successful:", user);

    // ✅ Optional: Store user in local storage if 'Remember me' is checked
    if (remember.value) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // ✅ Redirect after successful login
    navigateTo("/"); // change route as needed
  } catch (err) {
    console.error("Login error:", err);
    alert(error.value || "Login failed. Please try again.");
  }
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}

.login-card {
  border-radius: 20px;
  background: #fff;
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
</style>
