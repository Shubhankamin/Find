<template>
  <div>
    <v-container fluid>
      <v-row
        class="hero-section text-center py-12 justify-center align-center overflow-hidden"
      >
        <v-col cols="12" md="8" class="overflow-x-hidden">
          <h1 class="bebas-Bold-h1 text-white mb-4">Lost & Found</h1>
          <p class="manrope-regular-h5 text-white mb-6 mx-5">
            Lost something on campus or found an item? Use our platform to
            report, search, and reclaim belongings securely—only for students
            with a .edu email.
          </p>
          <div class="d-flex justify-center flex-wrap ga-8">
            <v-btn
              prepend-icon="mdi-plus-box"
              class="gradient-btn-secondary"
              size="large"
              rounded
              @click="$emit('open-dialog')"
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
    </v-container>
  </div>
</template>
<script setup>
defineEmits(["open-dialog"]);
</script>
<style scoped>
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
