<template>
  <div class="overflow-x-hidden pa-0 ma-0">
    <v-container class="py-12 mx-0 px-2 overflow-x-hidden" fluid>
      <v-row class="justify-center align-center overflow-x-hidden">
        <v-col
          cols="12"
          sm="6"
          md="3"
          lg="3"
          v-for="(item, index) in filteredItems"
          :key="index"
          class="d-flex justify-center"
        >
          <v-card
            class="modern-card"
            elevation="3"
            max-width="350"
            min-width="300"
          >
            <v-img
              :src="item.images?.[0]"
              height="200"
              cover
              class="rounded-lg"
            ></v-img>

            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.location }}</v-card-subtitle>

            <v-card-subtitle class="text-grey-darken-1 text-caption">
              Posted on: {{ formatDate(item.createdAt) }}
            </v-card-subtitle>

            <v-card-text class="truncate-text">
              {{ item.description }}
            </v-card-text>

            <v-card-actions>
              <div class="px-2">
                <button
                  class="px-8 bg-green py-2 text-white rounded-lg mb-4"
                  @click="openDialog(item)"
                >
                  Claim
                </button>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Claim Dialog -->
      <!-- <v-dialog v-model="showDialog" max-width="800">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">Claim Lost Item</span>
            <v-btn icon @click="showDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="justify-center">
              <v-col cols="12" md="6">
                <v-img
                  v-if="selectedItem?.images"
                  :src="selectedItem.images[0]"
                  height="200"
                  class="mb-3 rounded-lg"
                  cover
                ></v-img>
              </v-col>
            </v-row>

            <div class="pt-5">
              <div>
                <strong>Email:</strong> {{ selectedItem?.contactEmail }}
              </div>
              <div><strong>Location:</strong> {{ selectedItem?.location }}</div>
              <div>
                <strong>Description:</strong> {{ selectedItem?.description }}
              </div>
              <div>
                <strong>Posted On:</strong>
                {{ formatDate(selectedItem?.createdAt) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog> -->
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useLostItems } from "~/composables/useLostItems";

const props = defineProps({
  selectedCategory: {
    type: String,
    default: "",
  },
});

const showDialog = ref(false);
const selectedItem = ref<any>(null);
const cookies = useCookie("login");
const router = useRouter();
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

const openDialog = (item: any) => {
  if (!cookies.value) {
    router.push("/login");
    return;
  }
  selectedItem.value = item;
  showDialog.value = true;
};

const { getLostItems } = useLostItems();

const items = ref<any[]>([]);

const fetchItems = async () => {
  try {
    const data = await getLostItems();
    console.log("Fetched items:", data);
    items.value = data;
  } catch (err) {
    console.error("Error fetching lost items:", err);
  }
};

onMounted(() => {
  fetchItems();
});

const filteredItems = computed(() => {
  let result = items.value;

  if (
    props.selectedCategory &&
    props.selectedCategory.toLowerCase() !== "all"
  ) {
    result = result.filter(
      (item: any) =>
        item.category &&
        item.category.toLowerCase() === props.selectedCategory.toLowerCase()
    );
  }

  return result;
});
</script>

<style scoped>
.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
