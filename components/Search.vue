<template>
  <div>
    <v-container fluid class="overflow-hidden pa-0 ma-0">
      <v-row
        justify="center"
        class="bg-grey-lighten-4 overflow-hidden ma-0 pt-5"
      >
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search Lost Items"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            dense
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { debounce } from "lodash-es"; // ✅ Use lodash for debounce

const emit = defineEmits(["search"]);

const searchQuery = ref("");

// ✅ Debounced function to emit search text
const debouncedEmit = debounce((value) => {
  emit("search", value);
  console.log("Search emitted:", value);
}, 500); // 500ms delay

// ✅ Watch searchQuery and trigger debounce
watch(searchQuery, (newVal) => {
  debouncedEmit(newVal);
});
</script>
