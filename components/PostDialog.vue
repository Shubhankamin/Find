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
                  <!-- user-name -->
                  <v-text-field
                    v-model="UserName"
                    placeholder="User Name"
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
                    readonly
                  />

                  <!-- Category -->
                  <v-select
                    :items="categories"
                    placeholder="Select Category"
                    variant="outlined"
                    dense
                    v-model="selectedCategory"
                  />

                  <!-- Multi-Image Upload Section -->
                  <div class="upload-section mt-4">
                    <p class="mb-2 font-weight-medium">
                      Upload up to 4 images (Min 1 required)
                    </p>
                    <div class="d-flex flex-wrap" style="gap: 10px">
                      <div
                        v-for="(img, index) in images"
                        :key="index"
                        class="upload-box"
                        style="
                          width: 100px;
                          height: 100px;
                          border: 2px dashed #ccc;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          border-radius: 8px;
                          position: relative;
                          cursor: pointer;
                        "
                        @click="triggerFileInput(index)"
                      >
                        <input
                          type="file"
                          :ref="(el) => (fileInputs[index] = el)"
                          accept="image/*"
                          style="display: none"
                          @change="handleFileChange($event, index)"
                        />
                        <template v-if="img">
                          <img
                            :src="imagePreviews[index]"
                            alt="Preview"
                            style="
                              width: 100%;
                              height: 100%;
                              object-fit: cover;
                              border-radius: 8px;
                            "
                          />
                          <!-- Delete Icon -->
                          <v-btn
                            icon
                            size="small"
                            color="red"
                            style="
                              position: absolute;
                              top: 5px;
                              right: 5px;
                              background: white;
                            "
                            @click.stop="removeImage(index)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </template>
                        <template v-else>
                          <v-icon color="grey">mdi-plus</v-icon>
                        </template>
                      </div>
                    </div>
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
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLostItems } from "@/composables/useLostItems";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();
const cookies = useCookie("login");

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const showSnackbar = (message: string, color = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};
const categories = [
  "Bags",
  "Electronics",
  "Books",
  "Accessories",
  "Documents",
  "Others",
];
const selectedCategory = ref("");
const userEmail = cookies.value?.email || "";
console.log("User Email in PostDialog:", userEmail);
const userName = cookies.value?.displayName || "";
console.log("User Name in PostDialog:", userName);

const itemName = ref("");
const description = ref("");
const location = ref("");
const contactEmail = ref(userEmail);
const UserName = ref(userName);

const images = ref<(File | null)[]>([null, null, null, null]);
const imagePreviews = ref<(string | null)[]>([null, null, null, null]);
const fileInputs = ref<HTMLInputElement[]>([]);

const { addLostItem, loading, error } = useLostItems();

const triggerFileInput = (index: number) => {
  fileInputs.value[index]?.click();
};

const handleFileChange = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    images.value[index] = target.files[0];
    imagePreviews.value[index] = URL.createObjectURL(target.files[0]);
  }
};

const removeImage = (index: number) => {
  images.value[index] = null;
  imagePreviews.value[index] = null;
};

// ✅ Convert file to Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const submitForm = async () => {
  if (
    !itemName.value ||
    !description.value ||
    !location.value ||
    !contactEmail.value
  ) {
    showSnackbar("Please fill all required fields.", "error");
    return;
  }

  const selectedImages = images.value.filter((img) => img !== null);
  if (selectedImages.length < 1) {
    showSnackbar("Please upload at least one image.", "error");
    return;
  }

  try {
    // Convert all selected images to Base64
    const base64Images = await Promise.all(
      selectedImages.map((img) => convertToBase64(img!))
    );

    await addLostItem({
      itemName: itemName.value,
      description: description.value,
      location: location.value,
      contactEmail: contactEmail.value,
      userName: UserName.value,
      images: base64Images,
      category: selectedCategory.value,
    });

    showSnackbar("✅ Lost item posted successfully!", "success");
    emit("close");
    window.location.reload();

    // Reset form
    itemName.value = "";
    userName.value = "";
    description.value = "";
    location.value = "";
    contactEmail.value = "";
    images.value = [null, null, null, null];
    imagePreviews.value = [null, null, null, null];
  } catch (err) {
    console.error(err);
    showSnackbar("❌ Something went wrong!", "error");
  }
};
</script>
