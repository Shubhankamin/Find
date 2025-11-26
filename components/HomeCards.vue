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
            <div
              v-else-if="
                item.expiryDate?.toDate() <= new Date() &&
                item.status !== 'claimed'
              "
              class="expired-stamp"
            >
              EXPIRED
            </div>
            <v-img
              :src="item.images?.[0]"
              height="200"
              cover
              class="rounded-lg"
            ></v-img>

            <div class="px-4 py-4 d-flex flex-column ga-2">
              <p class="manrope-Bold-h5">{{ item.name }}</p>
              <p class="manrope-Bold-h5">{{ item.location }}</p>

              <p class="text-grey-darken-1 text-caption">
                Posted on: {{ formatDate(item.createdAt) }}
              </p>

              <p class="truncate-text manrope-Bold-h5">
                {{ item.description }}
              </p>
            </div>

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
                <!-- <Swiper :images="dialogImages" /> -->
                <GridImage :images="dialogImages" />
              </v-col>
            </v-row>

            <div class="details-container">
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ selectedItem?.contactEmail }}</span>
              </div>

              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">{{ selectedItem?.location }}</span>
              </div>

              <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">{{ selectedItem?.description }}</span>
              </div>

              <div class="detail-row">
                <span class="label">Posted On:</span>
                <span class="value">{{
                  formatDate(selectedItem?.createdAt)
                }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
    <div v-if="loadingMore" class="d-flex justify-center py-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div
      v-if="!loadingMore && !hasMore"
      class="text-center py-4 text-grey-darken-1 manrope-Bold-h6"
    >
      No more items to load
    </div>
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

// ✅ Helper function to convert various date formats to timestamp
const getTimestamp = (dateValue: any): number => {
  if (!dateValue) return 0;

  // Firestore Timestamp object
  if (dateValue.seconds !== undefined) {
    return dateValue.seconds * 1000 + (dateValue.nanoseconds || 0) / 1000000;
  }

  // Regular Date object or ISO string
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? 0 : date.getTime();
};

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

const { getLostItemsPaginated } = useLostItems();
const items = ref<any[]>([]);
const lastDoc = ref<any>(null);
const hasMore = ref(true);
const pageSize = 8; // how many items per load
const loadingMore = ref(false);

// const items = ref<any[]>([]);

const fetchItems = async () => {
  if (!hasMore.value || loadingMore.value) return;

  loadingMore.value = true;
  try {
    const {
      items: newItems,
      lastDoc: newLastDoc,
      hasMore: more,
    } = await getLostItemsPaginated(lastDoc.value, pageSize);

    items.value.push(...newItems);
    lastDoc.value = newLastDoc;
    hasMore.value = more;
  } catch (err) {
    console.error("Pagination fetch error:", err);
  } finally {
    loadingMore.value = false;
  }
};

onMounted(() => {
  fetchItems();
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  const bottomReached =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (bottomReached) fetchItems();
};

// ✅ Updated: Filter and sort by latest first
const filteredItems = computed(() => {
  // First filter: Only items with isEnabled === true
  let result = items.value.filter((item: any) => item.isEnabled === true);

  // Second filter: Apply category filter if selected
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

  // ✅ Sort by latest first (updatedAt first, fallback to createdAt)
  result.sort((a: any, b: any) => {
    const dateA = getTimestamp(a.updatedAt) || getTimestamp(a.createdAt);
    const dateB = getTimestamp(b.updatedAt) || getTimestamp(b.createdAt);
    return dateB - dateA; // Descending order (newest first)
  });

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
.expired-stamp {
  position: absolute;
  top: 10px;
  right: -25px;
  background: #e53935; /* red */
  color: white;
  font-weight: bold;
  padding: 6px 20px;
  transform: rotate(45deg);
  font-size: 14px;
  z-index: 5;
  border-radius: 4px;
}

.details-container {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  border: 2px solid rgba(20, 20, 20, 0.25);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

.detail-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 8px;
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.label {
  font-weight: 600;
  min-width: 105px;
  color: #4a4a4a;
}

.value {
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.45;
  flex: 1;
  word-break: break-word;
}
</style>
