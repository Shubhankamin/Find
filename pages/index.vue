<template>
  <div class="overflow-x-hidden">
    <v-container fluid class="pa-0 ma-0">
      <v-row
        class="hero-section text-center py-12 justify-center align-center overflow-hidden"
      >
        <v-col cols="12" md="12" class="overflow-x-hidden pa-0">
          <div class="d-flex justify-end px-5" v-if="logout">
            <v-tooltip text="Logout" location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon color="grey" @click="loggingOut">
                  <v-icon>mdi-power</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>

          <v-row class="justify-center align-center">
            <v-col cols="6" md="2" sm="4">
              <v-img src="/images/logo-2.png"></v-img>
            </v-col>
          </v-row>

          <!-- <h1 class="bebas-Bold-h1 text-white mb-4">Lost & Found</h1> -->

          <p class="manrope-regular-h5 text-white mb-6 mx-5">
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
            <!-- <v-btn
              prepend-icon="mdi-magnify"
              class="gradient-btn-secondary"
              size="large"
              rounded
            >
              View Items
            </v-btn> -->
          </div>
        </v-col>
      </v-row>
      <PostDialog :open="dialog" @close="closeDialog" />
      <!-- <Search @search="updateSearch" /> -->
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
const logout = ref(false);
const router = useRouter();
const selectedCategory = ref("");

const searchTerm = ref("");

const updateSearch = (term) => {
  searchTerm.value = term;
  console.log("Search term updated:", searchTerm.value);
};

onMounted(() => {
  console.log("Home Cookies:", cookies.value);
  if (cookies.value) {
    logout.value = true;
  } else {
    logout.value = false;
  }
});

const loggingOut = () => {
  cookies.value = null;
  logout.value = false;
  router.push("/");
  console.log("Logged out successfully");
};

const openDialog = () => {
  if (!cookies.value) {
    router.push("/login");
    return;
  } else {
    dialog.value = true;
  }
};

const closeDialog = () => {
  dialog.value = false;
};
const filterCategory = (category) => {
  selectedCategory.value = category;
};
</script>
<style scoped>
/* Hero Section Background */
.hero-section {
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
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
</style>
