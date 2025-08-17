import { ref, onMounted } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useCookie } from "#app";

export const useAuth = () => {
  const { $auth } = useNuxtApp(); // Firebase Auth instance
  const currentUser = ref<any>(null);
  const error = ref<string | null>(null);
  const message = ref<string | null>(null);
  // ✅ Login function
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );
      currentUser.value = userCredential.user;

      // ✅ Get ID Token
      const token = await userCredential.user.getIdToken();

      if (rememberMe) {
        localStorage.setItem("accessToken", token);
      } else {
        const tokenCookie = useCookie("accessToken", { maxAge: 3600 }); // 1 hour
        tokenCookie.value = token;
      }

      return userCredential.user;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  // ✅ Sign Up function (with name)
  const signUp = async (
    fullName: string,
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );

      // ✅ Update display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      currentUser.value = userCredential.user;

      // ✅ Get ID Token
      const token = await userCredential.user.getIdToken();

      if (rememberMe) {
        localStorage.setItem("accessToken", token);
      } else {
        const tokenCookie = useCookie("accessToken", { maxAge: 3600 }); // 1 hour
        tokenCookie.value = token;
      }

      return userCredential.user;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    error.value = null;
    message.value = null;
    try {
      await sendPasswordResetEmail($auth, email);
      message.value = "Password reset email sent. Check your inbox.";
    } catch (err: any) {
      error.value = err.message;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    await $auth.signOut();
    localStorage.removeItem("accessToken");
    const tokenCookie = useCookie("accessToken");
    tokenCookie.value = null;
    currentUser.value = null;
  };

  // ✅ Check Auth State and stored tokens
  onMounted(() => {
    onAuthStateChanged($auth, (user) => {
      if (user) {
        currentUser.value = user;
      } else {
        // Check token in storage/cookie
        const token =
          localStorage.getItem("accessToken") || useCookie("accessToken").value;
        if (token) {
          // We temporarily set a placeholder (Firebase will refresh)
          currentUser.value = { token };
        }
      }
    });
  });

  return {
    currentUser,
    error,
    login,
    signUp,
    logout,
    forgotPassword,
  };
};
