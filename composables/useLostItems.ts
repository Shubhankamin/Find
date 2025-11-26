import { ref } from "vue";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

export function useLostItems() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { $db } = useNuxtApp();

  // 🟢 Add new lost item
  const addLostItem = async (itemData: any) => {
    loading.value = true;
    error.value = null;

    try {
      const payload = {
        name: itemData.itemName,
        description: itemData.description,
        location: itemData.location,
        contactEmail: itemData.contactEmail,
        userName: itemData.userName,
        images: itemData.images || [],
        category: itemData.category,
        status: "active",
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection($db, "lost_item"), payload);
      return docRef.id;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 🔵 Get items (paginated)
  const getLostItemsPaginated = async (lastDoc: any = null, pageSize = 10) => {
    loading.value = true;
    error.value = null;

    try {
      let q = query(
        collection($db, "lost_item"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(
          collection($db, "lost_item"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return {
        items,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize,
      };
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    addLostItem,
    getLostItemsPaginated,
    loading,
    error,
  };
}
