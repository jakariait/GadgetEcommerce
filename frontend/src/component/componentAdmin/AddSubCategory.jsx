import React, { useEffect, useState } from "react";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore"; // Import the subcategory store
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const AddSubCategory = () => {
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const { createSubCategory } = useSubCategoryStore(); // Access createSubCategory from the store
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [featureCategory, setFeatureCategory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedCategory || !subCategoryName) {
      showSnackbar("Please select a category and enter a name.", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", subCategoryName);
    formData.append("category", selectedCategory);
    if (subCategoryImage) {
      formData.append("subCategoryImage", subCategoryImage);
    }
    formData.append("featureCategory", featureCategory);

    try {
      await createSubCategory(formData);
      showSnackbar("Subcategory created successfully!", "success");
      setSubCategoryName("");
      setSelectedCategory("");
      setSubCategoryImage(null);
      setFeatureCategory(true);

      setTimeout(() => {
        navigate("/admin/subcategorylist");
      }, 2000);
    } catch (err) {
      showSnackbar("Failed to create subcategory. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      {loading ? (
        <>
          <Skeleton height={100} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={100} width={"100%"} />
        </>
      ) : (
        <>
          <Box
            sx={{
              mx: "auto",
              p: 4,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 3,
              mt: 4,
            }}
          >
            <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
              Add Sub Category
            </h1>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Typography>Select Category</Typography>
                <Select
                  fullWidth
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Select one</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box mb={2}>
                <Typography>Name</Typography>
                <TextField
                  fullWidth
                  placeholder="Sub Category Name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                />
              </Box>

              <Box mb={2}>
                <Typography>Subcategory Image</Typography>
                <input
                  type="file"
                  onChange={(e) => setSubCategoryImage(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </Box>

              <Box mb={2}>
                <Typography>Feature Category</Typography>
                <Select
                  fullWidth
                  value={featureCategory}
                  onChange={(e) => setFeatureCategory(e.target.value)}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Sub Category"}
                </Button>
            </form>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </>
      )}
    </div>
  );
};

export default AddSubCategory;
