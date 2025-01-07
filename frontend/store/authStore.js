import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";
import { create } from "zustand";

export const authStore = create((set) => ({
  // State
  user: null,
  // State - Loading
  isAuthenticated: false,
  isSignupLoading: false,
  isCheckingVerification: false,
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
  verifyCode: async (verificaionCode) => {
    console.log("verificaionCode IN ZUSTAND", verificaionCode);
    const res = await axiosInstance.post("/verify-email", { verificaionCode });
    console.log(res.data);
    try {
      set({ isCheckingVerification: true });
      const res = await axiosInstance.post("/verify-email", verificaionCode);
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
}));
