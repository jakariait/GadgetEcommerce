import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import useProductOptionStore from "../../store/useProductOptionStore.js";
import useBrandStore from "../../store/useBrandStore.js"; // Added for brand selection
import AuthAdminStore from "../../store/AuthAdminStore.js";
import useProductStore from "../../store/useProductStore.js"; // Only for update mode
import { Editor } from "primereact/editor";
import Skeleton from "react-loading-skeleton"; // Only for update mode

import {
  Box,
  MenuItem,
  Select,
  Typography,
  Chip,
  Input,
  ListItemText,
  Checkbox,
  FormHelperText,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ProductForm = ({ isEditMode = false }) => {
  const { slug } = useParams(); // Only used in edit mode
  const { fetchProductBySlug, product } = useProductStore(); // Only for edit mode

  // Fetching data from the store
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const { flags } = useFlagStore();
  const { productOptions, fetchProductOptions } = useProductOptionStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = AuthAdminStore();
  const navigate = useNavigate();

  // Local state for form fields
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [productCode, setProductCode] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filteredChildCategories, setFilteredChildCategories] = useState([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(""); // Added for brand selection
  const [videoUrl, setVideoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null); // File object for new thumbnail
  const [imagePreview, setImagePreview] = useState(""); // URL for thumbnail preview
  const [selectedImages, setSelectedImages] = useState([]); // File objects for new multiple images
  const [imagePreviews, setImagePreviews] = useState([]); // URLs for new multiple image previews
  const [finalPrice, setFinalPrice] = useState("");
  const [finalDiscount, setFinalDiscount] = useState("");
  const [finalStock, setFinalStock] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [hasVariant, setHasVariant] = useState(true);
  const [variants, setVariants] = useState([
    {
      attributes: [{ option: "", value: "" }],
      stock: "",
      price: "",
      discount: "",
    },
  ]);
  const [isActive, setIsActive] = useState("true"); // Default to active for new products
  const [specification, setSpecification] = useState([
    { title: "", specs: [{ label: "", value: "" }] },
  ]);

  // State specific to update mode
  const [existingImages, setExistingImages] = useState([]); // Array of image names (strings) from backend
  const [imagesToDelete, setImagesToDelete] = useState([]); // Array of image names to delete

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null); // For thumbnail
  const imagesInputRef = useRef(null); // For multiple images

  const imageUrl = `${apiUrl.replace("/api", "")}/uploads`;

  // Fetching brands
  const { brands, fetchBrands } = useBrandStore();

  // Effect to fetch product data in edit mode
  useEffect(() => {
    if (isEditMode && slug) {
      fetchProductBySlug(slug);
    }
    fetchBrands(); // Fetch brands on component mount
    fetchProductOptions(); // Fetch product options on component mount
  }, [isEditMode, slug, fetchProductBySlug, fetchBrands, fetchProductOptions]);

  // Effect to populate form fields when product data is loaded (edit mode)
  useEffect(() => {
    if (isEditMode && product) {
      setName(product.name || "");
      setShortDesc(product.shortDesc || "");
      setLongDesc(product.longDesc || "");
      setProductCode(product.productCode || "");
      setRewardPoints(product.rewardPoints || "");
      setVideoUrl(product.videoUrl || "");
      setMetaTitle(product.metaTitle || "");
      setMetaDescription(product.metaDescription || "");
      setMetaKeywords(product.metaKeywords || []);
      setSearchTags(product.searchTags || []);
      setFinalPrice(product.finalPrice || "");
      setFinalDiscount(product.finalDiscount || "");
      setFinalStock(product.finalStock || "");
      setPurchasePrice(product.purchasePrice || "");
      setSelectedFlags(product.flags?.map((f) => f._id) || []);
      setIsActive(String(product.isActive));

      // Set category hierarchy
      if (product.category) {
        setSelectedCategory(product.category._id);
        const filteredSubs = subCategories.filter(
          (sub) => sub.category._id === product.category._id,
        );
        setFilteredSubCategories(filteredSubs);

        if (product.subCategory) {
          setSelectedSubCategory(product.subCategory._id);
          const filteredChilds = childCategories.filter(
            (child) => child.subCategory._id === product.subCategory._id,
          );
          setFilteredChildCategories(filteredChilds);

          if (product.childCategory) {
            setSelectedChildCategory(product.childCategory._id);
          }
        }
      }
      // Set brand
      if (product.brand) {
        setSelectedBrand(product.brand._id);
      }

      // Set thumbnail preview
      if (product.thumbnailImage) {
        setImagePreview(`${imageUrl}/${product.thumbnailImage}`);
      }

      // Set existing multiple images
      setExistingImages(product.images || []);

      // Set variants
      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((v) => ({
            attributes: v.attributes.map((attr) => ({
              option: attr.option._id,
              value: attr.value,
            })),
            stock: v.stock,
            price: v.price,
            discount: v.discount || "",
          })),
        );
        setHasVariant(true);
      } else {
        setVariants([
          {
            attributes: [{ option: "", value: "" }],
            stock: "",
            price: "",
            discount: "",
          },
        ]);
        setHasVariant(false);
      }

      if (product.specification && product.specification.length > 0) {
        setSpecification(product.specification);
      } else {
        setSpecification([{ title: "", specs: [{ label: "", value: "" }] }]);
      }
    }
  }, [isEditMode, product, subCategories, childCategories, apiUrl]);

  // Handlers (mostly copied from AddProduct, with minor adjustments for update)
  const handleToggle = () => {
    setHasVariant(!hasVariant);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        attributes: [{ option: "", value: "" }],
        stock: "",
        price: "",
        discount: "",
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleMultipleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => file);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImages = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });

    if (selectedImages.length === 1 && !isEditMode) {
      // Only reset input if not in edit mode and no new images left
      document.getElementById("multi-image-upload").value = "";
    }
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    const imageNameToDelete = existingImages[indexToRemove];
    setImagesToDelete((prev) => [...prev, imageNameToDelete]);
    setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveAllNewImages = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviews([]);
    if (imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }
  };

  const handleAddAttribute = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].attributes.push({ option: "", value: "" });
    setVariants(updatedVariants);
  };

  const handleRemoveAttribute = (variantIndex, attributeIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].attributes.splice(attributeIndex, 1);
    setVariants(updatedVariants);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThumbnailImage(file);
      setImagePreview(imageUrl);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!searchTags.includes(tagInput.trim())) {
        setSearchTags([...searchTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToDelete));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    setFilteredSubCategories([]);
    setSelectedChildCategory("");
    setFilteredChildCategories([]);

    if (categoryId) {
      const filteredSubs = subCategories.filter(
        (sub) => sub.category._id === categoryId,
      );
      setFilteredSubCategories(filteredSubs);
    }
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategory(subCategoryId);
    setSelectedChildCategory("");
    setFilteredChildCategories([]);

    if (subCategoryId) {
      const filteredChilds = childCategories.filter(
        (child) => child.subCategory._id === subCategoryId,
      );
      setFilteredChildCategories(filteredChilds);
    }
  };

  const handleChildCategoryChange = (e) => {
    setSelectedChildCategory(e.target.value);
  };

  const handleFlagChange = (e) => {
    const selected = e.target.value;
    setSelectedFlags(selected);
  };

  const handleFinalPriceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setFinalPrice(value);
  };

  const handleDiscountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setFinalDiscount(value);
  };

  const handleFinalStockChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setFinalStock(value);
  };

  const handleRewardPointsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setRewardPoints(value);
  };

  const handlePurchasePriceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setPurchasePrice(value);
  };

  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim() !== "") {
      e.preventDefault();
      if (!metaKeywords.includes(keywordInput.trim())) {
        setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setMetaKeywords(
      metaKeywords.filter((keyword) => keyword !== keywordToDelete),
    );
  };

  const handleSpecTitleChange = (e, index) => {
    const newSpecification = [...specification];
    newSpecification[index].title = e.target.value;
    setSpecification(newSpecification);
  };

  const removeSpecTitle = (index) => {
    const newSpecification = [...specification];
    newSpecification.splice(index, 1);
    setSpecification(newSpecification);
  };

  const addSpecTitle = () => {
    setSpecification([
      ...specification,
      { title: "", specs: [{ label: "", value: "" }] },
    ]);
  };

  const handleSpecChange = (e, titleIndex, specIndex, field) => {
    const newSpecification = [...specification];
    newSpecification[titleIndex].specs[specIndex][field] = e.target.value;
    setSpecification(newSpecification);
  };

  const removeSpec = (titleIndex, specIndex) => {
    const newSpecification = [...specification];
    newSpecification[titleIndex].specs.splice(specIndex, 1);
    setSpecification(newSpecification);
  };

  const addSpec = (titleIndex) => {
    const newSpecification = [...specification];
    newSpecification[titleIndex].specs.push({ label: "", value: "" });
    setSpecification(newSpecification);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    let validationErrors = {};
    if (!name.trim()) validationErrors.name = "Product name is required.";
    if (!selectedCategory) validationErrors.category = "Category is required.";
    if (!selectedBrand) validationErrors.brand = "Brand is required.";

    // Thumbnail image validation
    if (!imagePreview && !isEditMode) {
      // Required for add mode if no preview
      validationErrors.thumbnailImage = "Thumbnail image is required.";
    } else if (isEditMode && !imagePreview && !product?.thumbnailImage) {
      // Required for edit mode if no preview and no existing thumbnail
      validationErrors.thumbnailImage = "Thumbnail image is required.";
    }

    // Multiple images validation
    if (existingImages.length + selectedImages.length === 0) {
      validationErrors.images = "At least one image is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("shortDesc", shortDesc);
    formData.append("longDesc", longDesc);
    formData.append("productCode", productCode);
    formData.append("rewardPoints", rewardPoints);
    formData.append("videoUrl", videoUrl);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("finalPrice", finalPrice);
    formData.append("finalDiscount", finalDiscount);
    formData.append("finalStock", finalStock);
    formData.append("purchasePrice", purchasePrice);
    formData.append("isActive", isActive);

    if (selectedCategory) formData.append("category", selectedCategory);
    if (selectedSubCategory)
      formData.append("subCategory", selectedSubCategory);
    if (selectedChildCategory)
      formData.append("childCategory", selectedChildCategory);
    if (selectedBrand) formData.append("brand", selectedBrand); // Append selected brand

    selectedFlags.forEach((flag) => formData.append("flags", flag));
    searchTags.forEach((tag) => formData.append("searchTags", tag));
    metaKeywords.forEach((keyword) => formData.append("metaKeywords", keyword));

    if (thumbnailImage instanceof File) {
      formData.append("thumbnailImage", thumbnailImage);
    }

    // For update mode, append images to delete
    if (isEditMode && imagesToDelete.length > 0) {
      imagesToDelete.forEach((imageName) => {
        formData.append("imagesToDelete", imageName);
      });
    }

    // For update mode, append existing images that are not deleted
    if (isEditMode && existingImages.length > 0) {
      existingImages.forEach((imageName) => {
        formData.append("existingImages", imageName);
      });
    }

    selectedImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    const processedVariants = variants.filter(
      (variant) =>
        variant.attributes.length > 0 &&
        variant.attributes.every((attr) => attr.option && attr.value) &&
        variant.price &&
        variant.stock !== "" &&
        variant.stock != null,
    );

    if (hasVariant && processedVariants.length > 0) {
      processedVariants.forEach((variant, index) => {
        formData.append(`variants[${index}][stock]`, variant.stock);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][discount]`, variant.discount);
        variant.attributes.forEach((attr, attrIndex) => {
          formData.append(
            `variants[${index}][attributes][${attrIndex}][option]`,
            attr.option,
          );
          formData.append(
            `variants[${index}][attributes][${attrIndex}][value]`,
            attr.value,
          );
        });
      });
    }

    const processedSpecifications = specification.filter(
      (spec) =>
        spec.title &&
        spec.title.trim() !== "" &&
        spec.specs.length > 0 &&
        spec.specs.some(
          (s) =>
            (s.label && s.label.trim() !== "") ||
            (s.value && s.value.trim() !== ""),
        ),
    );

    if (processedSpecifications.length > 0) {
      formData.append("specification", JSON.stringify(processedSpecifications));
    }

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(
          `${apiUrl}/products/${product._id}`,
          formData,
          {
            // Use product._id here
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setSnackbarMessage("Product updated successfully!");
      } else {
        response = await axios.post(`${apiUrl}/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbarMessage("Product created successfully!");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      if (!isEditMode) {
        // Reset form for add mode
        setName("");
        setShortDesc("");
        setLongDesc("");
        setProductCode("");
        setRewardPoints("");
        setVideoUrl("");
        setMetaTitle("");
        setMetaDescription("");
        setFinalPrice("");
        setFinalDiscount("");
        setFinalStock("");
        setPurchasePrice("");
        setSelectedCategory("");
        setSelectedSubCategory("");
        setSelectedChildCategory("");
        setSelectedFlags([]);
        setSearchTags([]);
        setMetaKeywords([]);
        setThumbnailImage(null);
        setImagePreview("");
        setSelectedImages([]);
        setImagePreviews([]);
        setVariants([
          {
            attributes: [{ option: "", value: "" }],
            stock: "",
            price: "",
            discount: "",
          },
        ]);
        setHasVariant(true);
        setIsActive("true");
        setSpecification([{ title: "", specs: [{ label: "", value: "" }] }]);

        if (fileInputRef.current) fileInputRef.current.value = "";
        if (imagesInputRef.current) imagesInputRef.current.value = "";
      } else {
        // For edit mode, refresh data and clear new image states
        fetchProductBySlug(slug);
        setSelectedImages([]);
        setImagePreviews([]);
        setThumbnailImage(null);
        setImagesToDelete([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (imagesInputRef.current) imagesInputRef.current.value = "";
      }

      setErrors({});
      setTimeout(() => {
        navigate("/admin/viewallproducts");
      }, 3000);
    } catch (error) {
      setSnackbarMessage(
        `Failed to ${isEditMode ? "update" : "create"} product. Please try again.`,
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      if (error.response && error.response.data) {
        setErrors(error.response.data);
        console.error("API Error:", error.response.data); // Log the detailed API error
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  // Render loading skeleton in edit mode if product data is not yet loaded
  if (isEditMode && !product) {
    return (
      <div>
        <div className={"grid grid-cols-6 gap-6"}>
          <div className={"col-span-4"}>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={150} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={100} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
          <div className={"col-span-2 "}>
            <Skeleton height={150} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={100} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
        </div>
        <Skeleton height={250} width={"100%"} />
        <Skeleton height={200} width={"100%"} />
        <div className={"grid grid-cols-2 gap-6"}>
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
        </div>
        <Skeleton height={200} width={"100%"} />
      </div>
    );
  }

  return (
    <div className={"shadow rounded-lg p-3"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        {isEditMode ? "Update Product" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className={"md:grid grid-cols-12 gap-8 p-3"}>
          <div className={"col-span-8"}>
            {/* Product Name */}
            <TextField
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
            />

            {/* Short Description */}

            <h1 className={"py-3 pl-1"}>Short Description</h1>
            <Editor
              value={shortDesc}
              onTextChange={(e) => setShortDesc(e.htmlValue)}
              style={{ height: "260px" }}
            />

            {/* Long Description */}
            <h1 className={"py-3 pl-1"}>Long Description</h1>
            <Editor
              value={longDesc}
              onTextChange={(e) => setLongDesc(e.htmlValue)}
              style={{ height: "260px" }}
            />

            {/* Specification Section */}
            <div className={"shadow rounded-lg"}>
              <Box mt={4} p={2} borderRadius={2}>
                <Typography variant="h6" mb={2}>
                  Specification
                </Typography>
                {specification.map((specTitle, titleIndex) => (
                  <Box key={titleIndex} p={2} borderRadius={2} mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <TextField
                        label="Title"
                        fullWidth
                        value={specTitle.title}
                        onChange={(e) => handleSpecTitleChange(e, titleIndex)}
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeSpecTitle(titleIndex)}
                      >
                        Remove
                      </Button>
                    </Box>
                    {specTitle.specs.map((spec, specIndex) => (
                      <Box
                        key={specIndex}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        mt={2}
                      >
                        <TextField
                          label="Label"
                          value={spec.label}
                          onChange={(e) =>
                            handleSpecChange(e, titleIndex, specIndex, "label")
                          }
                        />
                        <TextField
                          label="Value"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(e, titleIndex, specIndex, "value")
                          }
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => removeSpec(titleIndex, specIndex)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    ))}
                    <Button
                      variant="contained"
                      onClick={() => addSpec(titleIndex)}
                      sx={{ mt: 2 }}
                    >
                      Add Spec
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addSpecTitle}
                >
                  + Add Specification Title
                </Button>
              </Box>
            </div>

            {/* Search Tag Input */}
            <Box mb={2}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                margin="normal"
              >
                <TextField
                  label="Search Tags"
                  fullWidth
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: searchTags.length > 0 && (
                      <InputAdornment position="start">
                        {/* Display all the chips inside the text field */}
                        <Box gap={1}>
                          {searchTags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              onDelete={() => handleDeleteTag(tag)}
                              size="small"
                              style={{
                                margin: "2px",
                                backgroundColor: "#e0e0e0",
                              }}
                            />
                          ))}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Video URL */}
              <TextField
                label="Video URL"
                fullWidth
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                margin="normal"
              />
            </Box>
          </div>
          <div className={"col-span-4"}>
            {/* Thumbnail Image Upload */}
            <Box mb={2}>
              <Typography>
                Product Thumbnail Image{" "}
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: "inline-block", // Hide the default file input
                }}
                id="thumbnail-upload"
                name="thumbnailImage"
                ref={fileInputRef} // Attach the ref here
                required={
                  !isEditMode ||
                  (isEditMode && !product?.thumbnailImage && !imagePreview)
                }
              />
              <label
                htmlFor="thumbnail-upload"
                style={{
                  display: "block",
                  height: "210px",
                  marginTop: "10px",
                  border: "2px solid #aaa",
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                  backgroundImage: imagePreview
                    ? `url(${imagePreview})`
                    : "none", // Use backgroundImage
                  backgroundColor: imagePreview ? "transparent" : "#f0f0f0", // Use backgroundColor
                  backgroundSize: "contain", // Changed to contain
                  backgroundRepeat: "no-repeat", // Prevent background from repeating
                  backgroundPosition: "center", // Center the image
                  color: imagePreview ? "transparent" : "#000",
                }}
              >
                {imagePreview ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      {thumbnailImage ? "New Image Selected" : "Current Image"}
                    </Typography>
                    {/* Remove Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        zIndex: 10,
                      }}
                      onClick={handleRemoveThumbnail}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    Click to upload an image
                  </Typography>
                )}
              </label>
              {errors.thumbnailImage && (
                <FormHelperText error>{errors.thumbnailImage}</FormHelperText>
              )}
            </Box>

            {!hasVariant && (
              <>
                {/* Final Price */}
                <TextField
                  label="Price (In BDT) "
                  type="number" // Make it a number input
                  fullWidth
                  value={finalPrice}
                  onChange={handleFinalPriceChange}
                  margin="normal"
                  required
                />
                {/* Final Discount Price */}
                <TextField
                  label="Discount Price"
                  type="number" // Make it a number input
                  fullWidth
                  value={finalDiscount}
                  onChange={handleDiscountChange}
                  margin="normal"
                />
                {/* Final Stock  */}
                <TextField
                  label="Stock"
                  type="number" // Make it a number input
                  fullWidth
                  value={finalStock}
                  onChange={handleFinalStockChange}
                  required
                  margin="normal"
                />
              </>
            )}

            {/*Is Active - only for edit mode*/}
            {isEditMode && (
              <Box sx={{ minWidth: 200, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={isActive}
                    label="Status"
                    onChange={(e) => setIsActive(e.target.value)}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Reward Points */}
            <TextField
              label="Reward Points"
              type="number" // Make it a number input
              fullWidth
              value={rewardPoints}
              onChange={handleRewardPointsChange}
              margin="normal"
            />
            {/* Purchase Price */}
            <TextField
              label="Purchase Price"
              type="number" // Make it a number input
              fullWidth
              value={purchasePrice}
              onChange={handlePurchasePriceChange}
              margin="normal"
            />
            {/* Product Code */}
            <TextField
              label="Product Code"
              fullWidth
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              margin="normal"
            />
            {/* Category Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.category)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="category-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                  required
                >
                  Select Category
                </InputLabel>

                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required={true}
                  displayEmpty
                  label="Select Category"
                  id="category-select" // Added id to link with InputLabel
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Subcategory Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.subCategory)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="subcategory-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Sub Category
                </InputLabel>

                <Select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategory}
                  label="Select Sub Category" // Label used in Select
                  id="subcategory-select" // Added id to link with InputLabel
                >
                  {filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((subCategory) => (
                      <MenuItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {selectedCategory
                        ? "No subcategories available"
                        : "Select a category first"}
                    </MenuItem>
                  )}
                </Select>

                {errors.subCategory && (
                  <FormHelperText>{errors.subCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Child Category Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.childCategory)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="child-category-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Child Category
                </InputLabel>

                <Select
                  value={selectedChildCategory}
                  onChange={handleChildCategoryChange}
                  displayEmpty
                  label="Select Child Category"
                  id="child-category-select" // Added id to link with InputLabel
                  disabled={!selectedSubCategory} // Disabled until a subcategory is selected
                >
                  {filteredChildCategories.length > 0 ? (
                    filteredChildCategories.map((childCategory) => (
                      <MenuItem
                        key={childCategory._id}
                        value={childCategory._id}
                      >
                        {childCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {selectedSubCategory
                        ? "No child categories available"
                        : "Select a subcategory first"}
                    </MenuItem>
                  )}
                </Select>

                {errors.childCategory && (
                  <FormHelperText>{errors.childCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Brand Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.brand)}>
                <InputLabel
                  htmlFor="brand-select"
                  sx={{
                    color: "grey",
                  }}
                  required
                >
                  Select Brand
                </InputLabel>
                <Select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  required={true}
                  displayEmpty
                  label="Select Brand"
                  id="brand-select"
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.brand && (
                  <FormHelperText>{errors.brand}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Flag Selection - Dropdown with Multiple Choices */}
            <Box mb={2}>
              <Typography>Select Flags</Typography>
              <Select
                multiple
                fullWidth
                value={selectedFlags}
                onChange={handleFlagChange}
                input={<Input />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((flagId) => {
                      const flag = flags.find((f) => f._id === flagId);
                      return (
                        <Chip
                          key={flag._id}
                          label={flag.name}
                          style={{ margin: 2 }}
                        />
                      );
                    })}
                  </div>
                )}
              >
                {flags.map((flag) => (
                  <MenuItem key={flag._id} value={flag._id}>
                    <Checkbox checked={selectedFlags.indexOf(flag._id) > -1} />
                    <ListItemText primary={flag.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </div>
        </div>

        <div className={"shadow rounded-lg p-3 mt-3"}>
          {/* Multiple Images Upload */}
          <Box mb={2}>
            <Typography>
              Product Images{" "}
              <span style={{ color: "red", fontSize: "18px" }}>*</span>
            </Typography>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesChange}
              style={{ display: "block" }} // Hide the default file input
              id="multi-image-upload"
              name="images"
              ref={imagesInputRef}
              required={existingImages.length + selectedImages.length === 0}
            />

            <label
              htmlFor="multi-image-upload"
              style={{
                marginTop: "10px",
                border: "2px solid #aaa",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                backgroundColor:
                  existingImages.length + selectedImages.length > 0
                    ? "transparent"
                    : "#f0f0f0",
                overflow: "hidden",
                padding: "10px",
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px", // Ensures space for images & button
              }}
            >
              {existingImages.length > 0 || selectedImages.length > 0 ? (
                <>
                  {selectedImages.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAllNewImages();
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >
                      Remove New Images
                    </button>
                  )}
                  <div
                    className={
                      "flex gap-5 flex-wrap mt-7 justify-center items-center"
                    }
                  >
                    {/* Existing images */}
                    {existingImages.map((image, index) => (
                      <div
                        key={`existing-${index}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          marginTop: "5px",
                          backgroundImage: `url(${imageUrl}/${image})`,
                          backgroundSize: "contain", // Improved for better fit
                          backgroundPosition: "center",
                          borderRadius: "5px",
                          position: "relative",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {/* Remove Button on each Image */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExistingImage(index);
                          }}
                          type={"button"}
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                            transition: "0.2s",
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* New image previews */}
                    {imagePreviews.map((image, index) => (
                      <div
                        key={`new-${index}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          marginTop: "5px",
                          backgroundImage: `url(${image})`,
                          backgroundSize: "contain", // Improved for better fit
                          backgroundPosition: "center",
                          borderRadius: "5px",
                          position: "relative",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {/* Remove Button on each Image */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImages(index);
                          }}
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                            transition: "0.2s",
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  Click to upload images
                </Typography>
              )}
            </label>
            {errors.images && (
              <FormHelperText error>{errors.images}</FormHelperText>
            )}
          </Box>
        </div>
        <div className={"shadow rounded-lg p-3 mt-3"}>
          {/*Variants Input*/}
          <Box border={1} p={2} borderRadius={2}>
            <div className="flex flex-col items-center">
              <Typography variant="h6" align="center">
                Product Has Variant?
              </Typography>
              <Switch checked={hasVariant} onChange={handleToggle} />
            </div>

            {hasVariant && (
              <>
                <Typography
                  variant="h6"
                  align="center"
                  color="error"
                  fontWeight={400}
                  sx={{ mb: 1 }}
                >
                  Product Variant (Insert the Base Variant First)
                </Typography>

                {/* Responsive Table Wrapper */}
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Attributes</TableCell>
                        <TableCell>Stock *</TableCell>
                        <TableCell>Price *</TableCell>
                        <TableCell>Disc. Price *</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variants.map((variant, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {variant.attributes.map((attr, attrIndex) => (
                              <Box
                                key={attrIndex}
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                              >
                                <TextField
                                  select
                                  label="Option"
                                  value={attr.option}
                                  onChange={(e) => {
                                    const updatedVariants = [...variants];
                                    updatedVariants[index].attributes[
                                      attrIndex
                                    ].option = e.target.value;
                                    updatedVariants[index].attributes[
                                      attrIndex
                                    ].value = ""; // Reset value
                                    setVariants(updatedVariants);
                                  }}
                                  sx={{ width: "120px" }}
                                >
                                  {productOptions.map((option) => (
                                    <MenuItem
                                      key={option._id}
                                      value={option._id}
                                    >
                                      {option.name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField
                                  select
                                  label="Value"
                                  value={attr.value}
                                  onChange={(e) => {
                                    const updatedVariants = [...variants];
                                    updatedVariants[index].attributes[
                                      attrIndex
                                    ].value = e.target.value;
                                    setVariants(updatedVariants);
                                  }}
                                  sx={{ width: "120px" }}
                                  disabled={!attr.option}
                                >
                                  {attr.option &&
                                    productOptions
                                      .find((o) => o._id === attr.option)
                                      ?.values?.map((val) => (
                                        <MenuItem key={val} value={val}>
                                          {val}
                                        </MenuItem>
                                      ))}
                                </TextField>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleRemoveAttribute(index, attrIndex)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ))}
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAddAttribute(index)}
                            >
                              + Add Attribute
                            </Button>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              fullWidth
                              value={variant.stock}
                              required={true}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Prevent negative values
                                if (value >= 0 || value === "") {
                                  const updatedVariants = [...variants];
                                  updatedVariants[index].stock = value;
                                  setVariants(updatedVariants);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              fullWidth
                              value={variant.price}
                              required={true}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Prevent negative values
                                if (value >= 0 || value === "") {
                                  const updatedVariants = [...variants];
                                  updatedVariants[index].price = value;
                                  setVariants(updatedVariants);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              fullWidth
                              value={variant.discount}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Prevent negative values
                                if (value >= 0 || value === "") {
                                  const updatedVariants = [...variants];
                                  updatedVariants[index].discount = value;
                                  setVariants(updatedVariants);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              fullWidth
                              onClick={() => handleRemoveVariant(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Centered Button */}
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddVariant}
                  >
                    + Add Another Variant
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </div>

        <div className={"shadow rounded-lg p-3 mt-3"}>
          <h1>
            Product SEO Information{" "}
            <span className={"text-red-500"}>(Optional)</span>{" "}
          </h1>
          <div className={"grid grid-cols-2 gap-4"}>
            {/* Meta Title */}
            <TextField
              label="Meta Title"
              fullWidth
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              margin="normal"
            />
            {/* Meta Keywords Input */}
            <Box mb={2}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                margin="normal"
              >
                <TextField
                  label="Met Keywords"
                  fullWidth
                  placeholder="Type a keyword and press Enter"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: metaKeywords.length > 0 && (
                      <InputAdornment position="start">
                        {/* Display all the chips inside the text field */}
                        <Box gap={1}>
                          {metaKeywords.map((keyword, index) => (
                            <Chip
                              key={index}
                              label={keyword}
                              onDelete={() => handleDeleteKeyword(keyword)}
                              size="small"
                              style={{
                                margin: "2px",
                                backgroundColor: "#e0e0e0",
                              }}
                            />
                          ))}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </div>

          {/* Meta Description */}
          <TextField
            label="Meta Description"
            fullWidth
            multiline
            rows={4}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            margin="none"
            InputProps={{
              style: { resize: "vertical", overflow: "auto" }, // This makes it resizable
            }}
          />
        </div>

        {/* Submit Button */}
        <div className={"flex justify-center items-center m-8"}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="mt-4"
          >
            {isEditMode ? "Update Product" : "Add Product"}
          </Button>
        </div>
        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position it at the top-right
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
};

export default ProductForm;
