import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useAuthAdminStore from "../../store/AuthAdminStore";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";

const EditSubCategory = () => {
  const { id } = useParams();
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { token } = useAuthAdminStore();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]);
  const [subCategoryImage, setSubCategoryImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${apiURL}/sub-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setSubCategory(res.data.subCategory);
        } else {
          setError("Subcategory not found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching subcategory data. Please try again.");
        setLoading(false);
      });

    axios
      .get(`${apiURL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch(() => {
        setError("Error fetching categories, please try again.");
      });
  }, [id, token, apiURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", subCategory?.name);
    formData.append("category", subCategory?.category._id);
    formData.append("isActive", subCategory?.isActive);
    if (subCategoryImage) {
      formData.append("subCategoryImage", subCategoryImage);
    }

    try {
      const response = await axios.put(
        `${apiURL}/sub-category/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setSnackbarMessage("Subcategory updated successfully!");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/admin/subcategorylist/"), 2000);
      }
    } catch (err) {
      let errorMessage =
        "Error updating subcategory: " +
        (err.response?.data?.message || err.message);
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Edit Subcategory
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <TextField
              label="Subcategory Name"
              value={subCategory?.name || ""}
              onChange={(e) =>
                setSubCategory({ ...subCategory, name: e.target.value })
              }
              variant="outlined"
              fullWidth
              required
              error={!subCategory?.name}
              helperText={!subCategory?.name ? "Subcategory name is required" : ""}
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={subCategory?.category?._id || ""}
                onChange={(e) =>
                  setSubCategory({
                    ...subCategory,
                    category: { _id: e.target.value },
                  })
                }
                label="Category"
              >
                <MenuItem value="">Select a Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth>
              <InputLabel>Active</InputLabel>
              <Select
                value={subCategory?.isActive ?? ""}
                onChange={(e) =>
                  setSubCategory({
                    ...subCategory,
                    isActive: e.target.value === "true" ? true : false,
                  })
                }
                label="Active"
              >
                <MenuItem value={"true"}>Yes</MenuItem>
                <MenuItem value={"false"}>No</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="space-y-2">
            <label>Subcategory Image</label>
            <input type="file" onChange={(e) => setSubCategoryImage(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            {subCategory?.subCategoryImage && (
              <ImageComponent
                imageName={subCategory?.subCategoryImage}
                className="w-40 h-40 mt-2 object-contain"
              />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Saving..." : "Save Subcategory"}
          </Button>
        </div>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default EditSubCategory;