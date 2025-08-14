<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-dialog
            :model-value="open"
            width="500"
            @click:outside="$emit('close')"
          >
            <v-card rounded="lg">
              <v-card-title class="text-h5 font-weight-bold pa-4">
                Post Lost Item
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form>
                  <!-- Item Name -->
                  <v-text-field
                    v-model="itemName"
                    placeholder="Item Name"
                    variant="outlined"
                    density="comfortable"
                    required
                  />

                  <!-- Description -->
                  <v-textarea
                    placeholder="Describe the item"
                    v-model="description"
                    variant="outlined"
                    density="comfortable"
                    rows="3"
                    auto-grow
                    required
                  />

                  <!-- Location -->
                  <v-text-field
                    placeholder="Where was it lost?"
                    v-model="location"
                    variant="outlined"
                    density="comfortable"
                    required
                  />

                  <!-- Email -->
                  <v-text-field
                    placeholder="Your contact email"
                    v-model="contactEmail"
                    type="email"
                    variant="outlined"
                    density="comfortable"
                    required
                  />

                  <!-- Custom Image Upload -->
                  <div class="upload-box" @click="triggerFileInput">
                    <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      capture="environment"
                      @change="handleFileChange"
                      style="display: none"
                    />
                    <div class="upload-content">
                      <v-btn color="primary" class="mb-2">Select Images</v-btn>
                      <p class="text-grey">or drag & drop here</p>
                    </div>
                  </div>

                  <!-- Show preview if image selected -->
                  <div
                    v-if="image"
                    class="mt-3 text-center"
                    style="position: relative; display: inline-block"
                  >
                    <img
                      :src="imagePreview"
                      alt="Preview"
                      style="max-width: 100%; border-radius: 8px"
                    />

                    <!-- Delete Icon -->
                    <v-btn
                      icon
                      size="small"
                      color="red"
                      style="
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        background: white;
                      "
                      @click="removeImage"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>

              <v-card-actions class="d-flex justify-end">
                <v-btn variant="text" color="grey" @click="$emit('close')">
                  Cancel
                </v-btn>
                <v-btn color="primary" class="text-black" @click="submitForm">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const itemName = ref("");
const description = ref("");
const location = ref("");
const contactEmail = ref("");
const image = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    image.value = target.files[0];
    imagePreview.value = URL.createObjectURL(image.value);
  }
};

const removeImage = () => {
  image.value = null;
  imagePreview.value = null;
};

const submitForm = () => {
  if (
    !itemName.value ||
    !description.value ||
    !location.value ||
    !contactEmail.value
  ) {
    alert("Please fill all required fields.");
    return;
  }

  const formData = {
    itemName: itemName.value,
    description: description.value,
    location: location.value,
    contactEmail: contactEmail.value,
    image: image.value,
  };

  console.log("Form Submitted:", formData);
  alert("Lost item posted successfully!");
  emit("close");
};
</script>
