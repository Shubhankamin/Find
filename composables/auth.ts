import { ref, onMounted } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { useCookie } from "#app";

export const useAuth = () => {
  const { $auth } = useNuxtApp(); 
  const currentUser = ref<any>(null);
  const error = ref<string | null>(null);
  const message = ref<string | null>(null);
  const emailVerified = ref<boolean>(false);

  const login = async (email: string, password: string) => {
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        await $auth.signOut(); 
        throw new Error("Please verify your email before logging in.");
      }

      currentUser.value = userCredential.user;

      const token = await userCredential.user.getIdToken();
      const tokenCookie = useCookie("accessToken", { maxAge: 3600 }); 
      tokenCookie.value = token;

      return userCredential.user;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      await sendEmailVerification(userCredential.user);

      await $auth.signOut();

      message.value =
        "Account created successfully. Please verify your email before logging in.";
      emailVerified.value = false;

      return userCredential.user;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const checkEmailVerification = async () => {
    if ($auth.currentUser) {
      await $auth.currentUser.reload();
      emailVerified.value = $auth.currentUser.emailVerified;
      return emailVerified.value;
    }
    return false;
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

  const logout = async () => {
    await $auth.signOut();
    localStorage.removeItem("accessToken");
    const tokenCookie = useCookie("accessToken");
    tokenCookie.value = null;
    currentUser.value = null;
  };

  onMounted(() => {
    onAuthStateChanged($auth, (user) => {
      if (user) {
        currentUser.value = user;
        emailVerified.value = user.emailVerified;
      } else {
        const token =
          localStorage.getItem("accessToken") || useCookie("accessToken").value;
        if (token) {
          currentUser.value = { token };
        }
      }
    });
  });

  return {
    currentUser,
    error,
    message,
    emailVerified,
    login,
    signUp,
    logout,
    forgotPassword,
    checkEmailVerification,
  };
};
