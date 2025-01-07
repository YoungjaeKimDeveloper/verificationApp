import { create } from "zustand";

export const authStore = create((set) => ({
  // State
  user: null,
  // State - Loading
  isAuthenticated: false,
  isLoading: false,
  isCheckAuth: false,
  //  State - Error
  error: null,
  //  Action
  signup: async (email, password, name) => {
    try {

    } catch (error) {
        
    }
  },
}));
