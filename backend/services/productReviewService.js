const ProductReview = require("../models/ProductReviewModel");

// Create a new review
const createReview = async (data) => {
  const review = new ProductReview(data);
  return review.save();
};

// Get all reviews for a specific product
const getReviewsByProduct = async (productId) => {
  const approvedReviews = await ProductReview.find({
    productId,
    status: "approved",
  })
    .populate("userId", " fullName")
    .sort({ createdAt: -1 });

  const totalReviews = approvedReviews.length;

  const averageRating =
    totalReviews > 0
      ? approvedReviews.reduce((acc, item) => item.rating + acc, 0) /
        totalReviews
      : 0;

  return {
    reviews: approvedReviews,
    totalReviews,
    averageRating: averageRating.toFixed(1),
  };
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

// Get all reviews (for admin)
const getAllReviews = async () => {
  return ProductReview.find({})
    .populate("userId", "fullName email")
    .populate("productId", "name") // Assuming product model has a 'name' field
    .sort({ createdAt: -1 });
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews,
};
