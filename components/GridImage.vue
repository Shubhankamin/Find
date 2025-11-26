<template>
  <div class="gallery">
    <div
      v-for="(img, i) in images"
      :key="i"
      class="gallery-item"
      @click="$emit('select', img)"
    >
      <v-img :src="img" cover />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => [],
  },
});

defineEmits(["select"]);
</script>

<style scoped>
.gallery {
  display: grid;
  gap: 12px;
}

/* Image card */
.gallery-item {
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  /* visible border */
  border: 2px solid rgba(22, 22, 22, 0.45);

  background: #fff;
  transition:
    transform 0.25s ease,
    box-shadow 0.3s ease,
    border-color 0.25s ease;

  /* ⬇ most important — makes all images equal in size */
  aspect-ratio: 1 / 1; /* square layout */
}

/* Hover interaction */
.gallery-item:hover {
  transform: scale(1.03);
  border-color: rgba(255, 255, 255, 0.65);
}

/* Dark overlay on hover */
.gallery-item::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.25s ease;
}
.gallery-item:hover::after {
  background: rgba(0, 0, 0, 0.12);
}

/* Ensure image fills and stays perfectly cropped */
.gallery-item :deep(img),
.gallery-item :deep(.v-img__img) {
  width: 100%;
  height: 100%;
  object-fit: cover !important;
}

/* ----- Grid layout rules based on number of images ----- */
.gallery:has(.gallery-item:nth-child(1)) {
  grid-template-columns: 1fr;
}

.gallery:has(.gallery-item:nth-child(2)) {
  grid-template-columns: 1fr 1fr;
}

.gallery:has(.gallery-item:nth-child(3)) {
  grid-template-columns: repeat(3, 1fr);
}

.gallery:has(.gallery-item:nth-child(4)) {
  grid-template-columns: repeat(2, 1fr);
}

.gallery:has(.gallery-item:nth-child(n + 5)) {
  grid-template-columns: repeat(3, 1fr);
}

/* Better spacing on mobile */
@media (max-width: 600px) {
  .gallery {
    gap: 8px;
  }
  .gallery:has(.gallery-item:nth-child(n + 3)) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
