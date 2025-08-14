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
          <v-card elevation="2" class="pa-4 hover-card">
            <v-icon size="36">{{ cat.icon }}</v-icon>
            <p class="mt-2">{{ cat.name }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const categories = [
  { name: "Electronics", icon: "mdi-cellphone" },
  { name: "Books", icon: "mdi-book" },
  { name: "Bags", icon: "mdi-bag-personal" },
  { name: "Accessories", icon: "mdi-watch" },
  { name: "Documents", icon: "mdi-file-document" },
  { name: "Others", icon: "mdi-dots-horizontal" },
];
</script>

<style scoped>
.hover-card {
  transition: 0.3s;
}
.hover-card:hover {
  transform: scale(1.05);
  background-color: #e3f2fd;
}
</style>
