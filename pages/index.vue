<template>
  <div class="overflow-x-hidden">
    <v-container fluid class="pa-0 ma-0">
      <!-- Professional Header/Navbar -->
      <v-app-bar color="transparent" flat class="header-bar px-4">
        <v-row class="align-center w-100" no-gutters>
          <!-- Logo Section -->
          <v-col cols="auto">
            <div class="d-flex align-center">
              <v-img
                src="/images/logo-2.png"
                max-width="50"
                max-height="50"
                class="mr-2"
              ></v-img>
              <!-- <span
                class="text-white font-weight-bold text-h6 d-none d-sm-block"
              >
                Lost & Found
              </span> -->
            </div>
          </v-col>

          <v-spacer></v-spacer>

          <!-- Auth Section -->
          <v-col cols="auto">
            <div class="d-flex align-center ga-3">
              <!-- User Info (when logged in) -->
              <template v-if="isLoggedIn">
                <v-chip
                  color="white"
                  variant="outlined"
                  class="d-none d-sm-flex"
                >
                  <v-icon start size="small">mdi-account-circle</v-icon>
                  {{ userEmail }}
                </v-chip>

                <v-btn
                  variant="outlined"
                  color="white"
                  rounded
                  @click="loggingOut"
                  class="auth-btn"
                >
                  <v-icon start>mdi-logout</v-icon>
                  <span class="d-none d-sm-inline">Logout</span>
                </v-btn>
              </template>

              <!-- Login Button (when not logged in) -->
              <template v-else>
                <v-btn
                  variant="flat"
                  color="white"
                  rounded
                  @click="goToLogin"
                  class="login-btn"
                >
                  <v-icon start>mdi-login</v-icon>
                  Login
                </v-btn>

                <v-btn
                  variant="outlined"
                  color="white"
                  rounded
                  @click="goToSignup"
                  class="signup-btn d-none d-sm-flex"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  Sign Up
                </v-btn>
              </template>
            </div>
          </v-col>
        </v-row>
      </v-app-bar>

      <!-- Hero Section -->
      <div v-if="announcement" class="announcement-wrapper">
        <div class="announcement-content">
          {{ announcement }}
        </div>
      </div>

      <v-row
        class="hero-section text-center py-12 justify-center align-center overflow-hidden"
      >
        <v-col cols="12" md="12" class="overflow-x-hidden pa-0 pt-16">
          <v-row class="justify-center align-center">
            <v-col cols="6" md="2" sm="4">
              <v-img src="/images/logo-2.png"></v-img>
            </v-col>
          </v-row>

          <p class="bebas-regular-h4 text-white mb-6 mx-5">
            Lost something on campus or found an item? Use our platform to
            report, search, and reclaim belongings securely—only for students
            with a .edu email.
          </p>

          <div class="d-flex justify-center flex-wrap ga-8">
            <v-btn
              prepend-icon="mdi-plus-box"
              class="gradient-btn"
              size="large"
              rounded
              @click="openDialog"
            >
              Post Lost Item
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <PostDialog :open="dialog" @close="closeDialog" />
      <Categories @categorySelected="filterCategory" />
      <HomeCards
        :selectedCategory="selectedCategory"
        :searchTerm="searchTerm"
        
      />
      <HowItWorks />
    </v-container>
  </div>
</template>

<script setup>
const dialog = ref(false);
const cookies = useCookie("login");
const router = useRouter();
const selectedCategory = ref("");
const searchTerm = ref("");

// Computed property for login state
const isLoggedIn = computed(() => !!cookies.value);
import { useClientAnnouncements } from "~/composables/useClientAnnouncements";

const { announcements, getClientAnnouncements } = useClientAnnouncements();
const announcement = ref("");
// Computed property for user email (extract from cookie if available)
const userEmail = computed(() => {
  if (cookies.value && typeof cookies.value === "object") {
    return cookies.value.email || "User";
  }
  return "User";
});

const updateSearch = (term) => {
  searchTerm.value = term;
  console.log("Search term updated:", searchTerm.value);
};

const loggingOut = () => {
  cookies.value = null;
  router.push("/");
  console.log("Logged out successfully");
};

const goToLogin = () => {
  router.push("/login");
};

const goToSignup = () => {
  router.push("/signup");
};

const openDialog = () => {
  if (!cookies.value) {
    router.push("/login");
    return;
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const filterCategory = (category) => {
  selectedCategory.value = category;
};

onMounted(async () => {
  await getClientAnnouncements();
  announcement.value = announcements.value.length
    ? announcements.value.join("   •   ")
    : "";
});
</script>

<style scoped>
/* Header Bar */
.header-bar {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent !important;
}

/* Hero Section Background */
.hero-section {
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
}

/* Auth Buttons */
.auth-btn {
  border-width: 2px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

.auth-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.login-btn {
  font-weight: 600;
  text-transform: none;
  color: black !important;
}

.login-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.signup-btn {
  border-width: 2px;
  font-weight: 600;
  text-transform: none;
}

.signup-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Gradient Buttons */
.gradient-btn {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 600;
}

.gradient-btn-secondary {
  background: linear-gradient(90deg, #10b981, #059669);
  color: white;
  font-weight: 600;
}

/* Text Truncate */
.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announcement-wrapper {
  background: linear-gradient(90deg, #e11d48, #f97316);
  color: white;
  font-weight: 600;
  padding: 20px 20px;
  position: relative;
  overflow: hidden;
}

.announcement-wrapper::before,
.announcement-wrapper::after {
  content: "";
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100%;
  pointer-events: none;
}

.announcement-wrapper::before {
  left: 0;
  /* background: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.4)); */
}

.announcement-wrapper::after {
  right: 0;
  /* background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.4)); */
}

.announcement-content {
  white-space: nowrap;
  animation: slideLeft 14s linear infinite;
}

@keyframes slideLeft {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
