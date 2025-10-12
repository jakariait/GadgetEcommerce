import { create } from "zustand";

const useBrandStore = create((set) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/brands`);
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();

      if (data.success) {
        set({ brands: data.data, loading: false });
      } else {
        throw new Error(data.message || "Failed to fetch brands");
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useBrandStore;