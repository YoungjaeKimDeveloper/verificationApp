import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";
import { create } from "zustand";

export const authStore = create((set) => ({
  // State
  user: null,

  // State - Loading
  isAuthenticated: false,
  isSignupLoading: false,
  isCheckAuth: false,
  //  State - Error
  error: null,
  //  Action
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
}));
