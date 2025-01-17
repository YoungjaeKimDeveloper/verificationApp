import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";
import { create } from "zustand";

export const authStore = create((set, get) => ({
  // State
  user: null,
  // State - Loading
  isAuthenticated: false,
  isSignupLoading: false,
  isCheckingVerification: false,
  isCheckingAuth: false,
  isLogoutLoading: false,
  isForgotPasswordLoading: false,
  isResetPasswordLoading: false,
  //  State - Error
  error: null,
  logoutError: null,
  isResetPasswordLoadingMessage: null,
  // State - Message
  forgotPasswordMessage: null,
  //  Action
  // resetPassword
  resetPasswordMessage: null,
  resetPasswordError: null,

  signup: async (data) => {
    try {
      set({ isSignupLoading: true });
      const res = await axiosInstance.post("/signup", data);
      set({ user: res.data.newUser });
      set({ isCheckAuth: true });
      toast.success("Success : TESTER");
      return true;
    } catch (error) {
      set({ error: error?.response?.data?.message || "FAILED TO SIGN UP" });
      console.error(
        "FAILED TO SIGN UP",
        error?.response?.data?.message || "FAILED TO SIGN UP"
      );
      toast.error(`FAILED TO SIGN UP ${error?.response?.data?.message}`);
      throw error;
    } finally {
      set({ isSignupLoading: false });
    }
  },
  // Login
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/login", data);
      set({ user: res.data.user });
      set({ isAuthenticated: true });
      toast.success("USER LOGGINED ✅");
    } catch (error) {
      set({ user: null });
      set({ isAuthenticated: false });
      console.error("FAILED TO LOGIN IN ❌", error?.response);
      toast.error("FAILED TO LOGIN");
    }
  },
  logout: async () => {
    try {
      set({ isLogoutLoading: true });
      await axiosInstance.post("/logout");
      set({ user: null });
    } catch (error) {
      set({ logoutError: error.message });
    } finally {
      set({ isLogoutLoading: false });
    }
  },

  // Verification
  verifyCode: async (verificaionCode) => {
    try {
      set({ isCheckingVerification: true });
      const res = await axiosInstance.post("/verify-email", {
        verificaionCode,
      });
      if (res.data.success === 200) {
        toast.success("Pass the Email Token Successfully");
      }
      return true;
    } catch (error) {
      console.error(
        "FAILED TO VERIFY TOKEN : ",
        error?.response?.data?.message
      );
      toast.error(`${error?.response?.data?.message}`);
      return false;
    } finally {
      set({ isCheckingVerification: false });
    }
  },
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/check-auth");
      set({ user: res.data.user });
      set({ isAuthenticated: true });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to cehckaUth" });
      set({ isAuthenticated: false });
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  forgotPassword: async (email) => {
    try {
      set({ isForgotPasswordLoading: true });
      const res = await axiosInstance.post(`/forgot-password`, { email });
      set({
        forgotPasswordMessage: res.data.message,
        isForgotPasswordLoading: false,
      });
      console.info("SEND THE EMAIL SUCCESSFULLY ✅");
    } catch (error) {
      console.error(
        "FAIL TO SEND FORGOT PASSWORD VERIFICATION EMAIL : ",
        error?.response?.data?.message
      );
      set({
        forgotPasswordMessage:
          error?.response?.data?.message ||
          "Error sending reset password email",
      });
    } finally {
      set({
        isForgotPasswordLoading: false,
      });
    }
  },
  // Focus
  resetPassword: async (token, password) => {
    set({ isResetPasswordLoading: true });
    try {
      const response = await axiosInstance.post(`/reset-password/${token}`, {
        password,
      });
      set({ isResetPasswordLoading: false });
      set({ resetPasswordMessage: response?.data?.message });
    } catch (error) {
      console.error("ERROR IN resetPassword", error?.resposne?.data?.message);
      set({ resetPasswordError: error?.resposne?.data?.message });
    } finally {
      set({ isResetPasswordLoading: false });
    }
  },
}));

// resetPassword
