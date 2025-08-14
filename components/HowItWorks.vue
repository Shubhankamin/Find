<template>
  <v-row class="ma-0  text-center bg-light-blue-lighten-4 overflow-hidden">
    <v-col cols="12">
      <h2 class="text-h4 font-weight-bold mb-6">How It Works</h2>
    </v-col>
    <v-col cols="12" md="3" v-for="(step, index) in steps" :key="index">
      <v-icon size="48" class="mb-2">{{ step.icon }}</v-icon>
      <h3 class="text-h6">{{ step.title }}</h3>
      <p>{{ step.desc }}</p>
    </v-col>
  </v-row>
</template>

<script setup>
const steps = [
  { title: "Post an Item", desc: "Submit details of a lost or found item.", icon: "mdi-plus-box" },
  { title: "Browse Listings", desc: "Search through available items.", icon: "mdi-magnify" },
  { title: "Claim Item", desc: "Verify and reclaim your lost belongings.", icon: "mdi-check-circle" },
  { title: "Stay Connected", desc: "Communicate securely with finders.", icon: "mdi-chat" },
];
</script>
