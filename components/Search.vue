<template>
  <div>
    <v-container fluid class="overflow-hidden pa-0 ma-0">
      <v-row justify="center" class="bg-grey-lighten-4 overflow-hidden ma-0 pt-5">
        <v-col cols="12" md="6" class="">
          <v-text-field
          placeholder="Search Lost Items"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            dense
          />
        </v-col>
        <!-- <v-col cols="12" md="3">
          <v-select
            :items="categories"
            label="Filter by Category"
            variant="outlined"
            dense
          />
        </v-col> -->
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// const categories = ["All", "Electronics", "Books", "Accessories", "Documents"];
</script>
