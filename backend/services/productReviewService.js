const ProductReview = require("../models/ProductReviewModel");

// Create a new review
const createReview = async (data) => {
  const review = new ProductReview(data);
  return review.save();
};

// Get all reviews for a specific product
const getReviewsByProduct = async (productId) => {
  return ProductReview.find({ productId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

// Get single review by ID
const getReviewById = async (id) => {
  return ProductReview.findById(id).populate("userId", "name email");
};

// Update review (e.g., edit comment, rating, or approve)
const updateReview = async (id, updateData) => {
  return ProductReview.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete review
const deleteReview = async (id) => {
  return ProductReview.findByIdAndDelete(id);
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};
