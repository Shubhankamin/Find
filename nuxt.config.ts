import Aura from "@primeuix/themes/aura";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@primevue/nuxt-module",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
  ],
  css: ["@/assets/css/style.css"],
  vite: {
    plugins: [tailwindcss()],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
        options: { darkModeSelector: "system" },
      },
    },
  },
});
