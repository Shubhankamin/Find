import { ref } from "vue";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useNuxtApp } from "#app";

export function useLostItems() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { $db } = useNuxtApp();

  // ✅ Add new lost item
  const addLostItem = async (itemData: {
    itemName: string;
    description: string;
    location: string;
    contactEmail: string;
    image?: string | null; // Base64
    category: string;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      const docRef = await addDoc(collection($db, "lost_item"), {
        ...itemData,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch all lost items
  const getLostItems = async () => {
    loading.value = true;
    error.value = null;

    try {
      const querySnapshot = await getDocs(collection($db, "lost_item"));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    addLostItem,
    getLostItems,
    loading,
    error,
  };
}
