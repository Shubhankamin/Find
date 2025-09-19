<template>
  <div>
    <!-- Selected Image -->
    <!-- <div>
      <v-img :src="selectedImage" height="300" cover />
    </div> -->

    <!-- Swiper Carousel -->
    <Swiper
      :key="sliderImages.join(',')"
      :modules="[Navigation]"
      :slides-per-view="1"
      :loop="sliderImages.length > 1"
      :speed="600"
      :navigation="true"
      :pagination="{ clickable: true }"
      class="mySwiper rounded-xl"
      @slideChange="onSlideChange"
      @reachBeginning="onReachBeginning"
      @reachEnd="onReachEnd"
      space-between="10"
      :loop-fill-group-with-blank="true"
    >
      <SwiperSlide
        v-for="(item, i) in sliderImages"
        :key="i"
        @click="handleImageSelect(item)"
      >
        <div class="hello px-10">
          <v-img :src="item" height="300" width="100%" cover />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => [],
  },
});

const selectedImage = ref("");
const sliderImages = ref<string[]>([]);

watch(
  () => props.images,
  (newVal) => {
    sliderImages.value = Array.isArray(newVal) ? newVal : [];
    selectedImage.value = sliderImages.value[0] || "";
  },
  { immediate: true }
);

// const handleImageSelect = (image: string) => {
//   selectedImage.value = image;
// };

const onSlideChange = (swiper: any) => {
  console.log(
    `Slide changed → activeIndex: ${swiper.activeIndex}, realIndex: ${swiper.realIndex}`
  );
  console.log("Currently visible slide:", sliderImages.value[swiper.realIndex]);
};


const onReachBeginning = () => {
  console.log("Reached beginning of slides");
};

const onReachEnd = () => {
  console.log("Reached end of slides");
};
</script>

<style scoped>
.hello {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.hello:hover {
  transform: scale(1.05);
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: #000;
  z-index: 9999;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #603813 !important;
}

:deep(.swiper-pagination-bullet) {
  background-color: #aaa;
}
</style>
