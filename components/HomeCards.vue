<template>
  <div class="overflow-x-hidden pa-0 ma-0">
    <v-container class="py-12 mx-0 px-2 overflow-x-hidden" fluid>
      <v-row class="justify-center align-center overflow-x-hidden">
        <v-col
          cols="12"
          sm="6"
          md="3"
          lg="3"
          v-for="(item, index) in items"
          :key="index"
          class="d-flex justify-center"
        >
          <v-card class="modern-card" elevation="3" max-width="350">
            <!-- Image -->
            <v-img
              :src="item.image"
              height="200"
              cover
              class="rounded-lg"
            ></v-img>

            <!-- Title & Location -->
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.location }}</v-card-subtitle>

            <!-- Date Posted -->
            <v-card-subtitle class="text-grey-darken-1 text-caption">
              Posted on: {{ formatDate(item.datePosted) }}
            </v-card-subtitle>

            <!-- Description -->
            <v-card-text class="truncate-text">
              {{ item.description }}
            </v-card-text>

            <!-- Actions -->
            <v-card-actions>
              <div class="px-2">
                <button class="px-8 bg-green py-2 text-white rounded-lg mb-4">
                  Claim
                </button>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const items = [
  {
    name: "Blue Backpack",
    location: "Library",
    description: "A blue backpack with books and a water bottle.",
    image: "/images/watch.jpg",
    datePosted: "2025-08-14T10:30:00Z",
  },
  {
    name: "Blue Backpack",
    location: "Library",
    description: "A blue backpack with books and a water bottle.",
    image: "/images/watch.jpg",
    datePosted: "2025-08-14T10:30:00Z",
  },
  {
    name: "Blue Backpack",
    location: "Library",
    description: "A blue backpack with books and a water bottle.",
    image: "/images/watch.jpg",
    datePosted: "2025-08-14T10:30:00Z",
  },
  {
    name: "Blue Backpack",
    location: "Library",
    description: "A blue backpack with books and a water bottle.",
    image: "/images/watch.jpg",
    datePosted: "2025-08-14T10:30:00Z",
  },
  {
    name: "Blue Backpack",
    location: "Library",
    description: "A blue backpack with books and a water bottle.",
    image: "/images/watch.jpg",
    datePosted: "2025-08-14T10:30:00Z",
  },
];
</script>
<style scoped>
/* Text Truncate */
.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
