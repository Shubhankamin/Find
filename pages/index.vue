<template>
  <div class="overflow-x-hidden">
    <v-container fluid class="pa-0 ma-0">
      <v-row
        class="hero-section text-center py-12 justify-center align-center overflow-hidden"
      >
        <v-col cols="12" md="12" class="overflow-x-hidden">
          <div class="d-flex justify-end px-5" v-if="logout">
            <v-btn class="bg-grey">Logout</v-btn>
          </div>
          <h1 class="bebas-Bold-h1 text-white mb-4">Lost & Found</h1>

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
      <PostDialog :open="dialog" @close="closeDialog" /> <Search />
      <Categories />

      <HomeCards />
      <HowItWorks />
    </v-container>
  </div>
</template>
<script setup>
const dialog = ref(false);
const cookies = useCookie("login");
const logout = ref(false);
const router = useRouter();
onMounted(() => {
  console.log("Home Cookies:", cookies.value);
  if (cookies.value) {
    logout.value = true;
  } else {
    logout.value = false;
  }
});

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
