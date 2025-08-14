<template>
  <v-container
    fluid
    class="signup-container d-flex align-center justify-center"
  >
    <v-row class="justify-center">
      <v-col class="d-flex align-center justify-center" cols="12">
        <v-card class="signup-card pa-10" max-width="450" elevation="5">
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">Create Account</h1>
            <p class="text-body-2 text-medium-emphasis">
              Join Lost & Found and manage your items
            </p>
          </div>

          <!-- Form -->
          <v-form ref="signupForm">
            <v-text-field
              placeholder="Full Name"
              variant="outlined"
              prepend-inner-icon="mdi-account-outline"
              class="mb-4 rounded-input"
              v-model="fullName"
              :rules="[rules.required]"
              density="compact"
            />

            <v-text-field
              placeholder="Enter your email"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
              class="mb-4 rounded-input"
              density="compact"
              v-model="email"
              :rules="[rules.required, rules.emailFormat]"
            />

            <v-text-field
              placeholder="Create password"
              type="password"
              variant="outlined"
              prepend-inner-icon="mdi-lock-outline"
              class="mb-4 rounded-input"
              density="compact"
              v-model="password"
              :rules="[rules.required, rules.password]"
            />

            <v-text-field
              placeholder="Confirm password"
              type="password"
              variant="outlined"
              prepend-inner-icon="mdi-lock-check-outline"
              class="mb-4 rounded-input"
              density="compact"
              v-model="confirmPassword"
              :rules="[rules.required, rules.matchPassword]"
            />

            <!-- Sign Up Button -->
            <v-btn
              block
              color="primary"
              size="large"
              class="rounded-pill text-white mb-6"
              type="submit"
              @click="handleSignup"
            >
              Sign Up
            </v-btn>

            <!-- Divider -->
            <div class="divider mb-6">
              <span>OR</span>
            </div>

            <!-- Already have an account -->
            <p class="text-center text-body-2 mt-6">
              Already have an account?
              <v-btn
                variant="text"
                size="small"
                class="text-primary"
                @click="goToLogin"
              >
                Sign In
              </v-btn>
            </p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/auth";

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const signupForm = ref(null);
const router = useRouter();

const { signUp, error } = useAuth();

// ✅ Remove email format validation for now
const rules = {
  required: (value: string) => !!value || "This field is required",
  password: (value: string) =>
    value.length >= 6 || "Password must be at least 6 characters",
  matchPassword: (value: string) =>
    value === password.value || "Passwords do not match",
};

const goToLogin = () => {
  router.push("/login");
};

// ✅ Simplified signup handler (NO email regex check)
const handleSignup = async () => {
  try {
    await signUp(fullName.value, email.value, password.value);
    console.log("Signup successful");
    router.push("/"); // Redirect to home or dashboard
  } catch (err) {
    console.error("Signup error:", error.value);
  }
};
</script>

<style scoped>
.signup-container {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}

.signup-card {
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
