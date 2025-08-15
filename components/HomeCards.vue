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
          <v-card class="modern-card" elevation="3" max-width="350" min-width="300">
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
              Posted on: {{ formatDate(item.createdAt) }}
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
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLostItems } from "~/composables/useLostItems";

// ✅ Format Date Function
const formatDate = (dateString: any) => {
  if (!dateString) return "N/A";
  const date =
    dateString.seconds !== undefined
      ? new Date(dateString.seconds * 1000)
      : new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ✅ Use Composable
const { getLostItems, loading, error } = useLostItems();

// ✅ Reactive items array
const items = ref<any[]>([]);

// ✅ Fetch Data on Mount
onMounted(async () => {
  try {
    items.value = await getLostItems();
  } catch (err) {
    console.error(err);
  }
});
</script>
<style scoped>
/* Text Truncate */
.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
