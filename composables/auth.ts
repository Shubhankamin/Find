import { ref } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const useAuth = () => {
  const { $auth } = useNuxtApp(); // Firebase Auth instance
  const currentUser = ref<any>(null);
  const error = ref<string | null>(null);

  // ✅ Login function
  const login = async (email: string, password: string) => {
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password);
      currentUser.value = userCredential.user;
      return userCredential.user;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  // ✅ Sign Up function (with name support)
  const signUp = async (fullName: string, email: string, password: string) => {
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword($auth, email, password);
      // ✅ Update display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
      currentUser.value = userCredential.user;
      return userCredential.user;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    currentUser,
    error,
    login,
    signUp,
  };
};
