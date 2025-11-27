import { ref } from "vue";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNuxtApp } from "#app";

export function useClientAnnouncements() {
  const announcements = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { $db } = useNuxtApp();

  const getClientAnnouncements = async () => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection($db, "announcements"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);

      // Only show active announcements & convert to string array
      announcements.value = snap.docs
        .map((doc) => doc.data())
        .filter((a) => a.isActive)
        .map((a) => a.message);

      return announcements.value;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { announcements, getClientAnnouncements, loading, error };
}
