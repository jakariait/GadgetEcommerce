import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useBrandStore = create((set) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/brands`);
      set({ brands: response.data.brands || [], loading: false });
    } catch (error) {
      console.error("Error fetching brands:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch brands",
        loading: false,
      });
    }
  },
}));

export default useBrandStore;
