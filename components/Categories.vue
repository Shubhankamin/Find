<template>
  <div>
    <v-container fluid class="overflow-hidden pa-0 ma-0">
      <v-row class="pa-0 text-center overflow-hidden ma-0">
        <v-col
          cols="6"
          sm="4"
          md="2"
          v-for="(cat, index) in categories"
          :key="index"
        >
          <v-card
            elevation="2"
            class="pa-4 hover-card"
            :class="{ active: selectedCategory === cat.name }"
            @click="toggleCategory(cat.name)"
          >
            <v-icon size="36">{{ cat.icon }}</v-icon>
            <p class="mt-2 manrope-Bold-h5">{{ cat.name }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- ✅ Selected Category Display with Close Button -->
      <v-row v-if="selectedCategory" class="mt-4 justify-center">
        <v-chip
          color="primary"
          class="ma-2 manrope-Bold-h5"
          closable
          @click:close="clearCategory"
        >
          {{ selectedCategory }}
        </v-chip>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["category-selected"]);

const categories = [
  { name: "Electronics", icon: "mdi-cellphone" },
  { name: "Books", icon: "mdi-book" },
  { name: "Bags", icon: "mdi-bag-personal" },
  { name: "Accessories", icon: "mdi-watch" },
  { name: "Documents", icon: "mdi-file-document" },
  { name: "Others", icon: "mdi-dots-horizontal" },
];

const selectedCategory = ref("");

// ✅ Toggle category selection
const toggleCategory = (category) => {
  if (selectedCategory.value === category) {
    clearCategory(); // Deselect if clicked again
  } else {
    selectedCategory.value = category;
    emit("category-selected", category);
    console.log("Selected Category:", category);
  }
};

// ✅ Clear category and emit empty value
const clearCategory = () => {
  selectedCategory.value = "";
  emit("category-selected", "");
  console.log("Category cleared");
};
</script>

<style scoped>
.hover-card {
  transition: 0.3s;
  cursor: pointer;
}
.hover-card:hover {
  transform: scale(1.05);
  background-color: #e3f2fd;
}
.active {
  border: 2px solid #1976d2;
  background-color: #e3f2fd;
}
</style>
