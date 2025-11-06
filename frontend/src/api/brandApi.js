import axios from "axios";
import AuthAdminStore from "../store/AuthAdminStore.js";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/brands`;


// Create a new brand
export const createBrand = async (brandData) => {
  const { token } = AuthAdminStore.getState();
  const response = await axios.post(API_URL, brandData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all brands
export const getBrands = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// Get a single brand by ID
export const getBrandById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update a brand
export const updateBrand = async (id, brandData) => {
  const { token } = AuthAdminStore.getState();
  const response = await axios.put(`${API_URL}/${id}`, brandData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a brand
export const deleteBrand = async (id) => {
  const { token } = AuthAdminStore.getState();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};