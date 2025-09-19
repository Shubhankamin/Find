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
            class="modern-card relative-card"
            elevation="3"
            max-width="350"
            min-width="300"
          >
            <div v-if="item.status === 'claimed'" class="claimed-stamp">
              CLAIMED
            </div>
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
                  Details
                </button>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="showDialog" max-width="800">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">Claim Lost Item</span>
            <v-btn icon @click="showDialog = false" class="bg-blue">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="justify-center">
              <v-col cols="12" md="6">
                <!-- <v-img
                  v-if="selectedItem?.images"
                  :src="selectedItem.images[0]"
                  height="200"
                  class="mb-3 rounded-lg"
                  cover
                ></v-img> -->
                <Swiper :images="dialogImages" />
              </v-col>
            </v-row>

            <div class="pt-5 d-flex flex-column gap-5">
              <div class="d-flex ga-2 align-center">
                <b>Email:</b> {{ selectedItem?.contactEmail }}
              </div>
              <div class="d-flex ga-2 align-center">
                <b>Location:</b> {{ selectedItem?.location }}
              </div>
              <div class="d-flex ga-2 align-center">
                <b>Description:</b> {{ selectedItem?.description }}
              </div>
              <div class="d-flex ga-2 align-center">
                <b>Posted On:</b>
                {{ formatDate(selectedItem?.createdAt) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useLostItems } from "~/composables/useLostItems";
import Swiper from "./Swiper.vue";

const props = defineProps({
  selectedCategory: {
    type: String,
    default: "",
  },
});

const slideImages = ref();

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

const dialogImages = ref<string[]>([]);

const openDialog = (item: any) => {
  if (!cookies.value) {
    router.push("/login");
    return;
  }
  selectedItem.value = item;
  dialogImages.value = item?.images || [];
  showDialog.value = true;
};

const { getLostItems } = useLostItems();

const items = ref<any[]>([]);

const fetchItems = async () => {
  try {
    const data = await getLostItems();
    console.log("Fetched items:", data);
    items.value = data;
    console.log("Slide Images:", slideImages.value);
  } catch (err) {
    console.error("Error fetching lost items:", err);
  }
};

onMounted(() => {
  fetchItems();
});

const filteredItems = computed(() => {
  let result = items.value.filter(
    (item: any) => item.isEnabled === true || item.isEnabled === undefined
  );
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
.relative-card {
  position: relative;
}

.claimed-stamp {
  position: absolute;
  top: 20px;
  right: -40px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  font-weight: bold;
  padding: 5px 50px;
  transform: rotate(45deg);
  font-size: 14px;
  text-transform: uppercase;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
