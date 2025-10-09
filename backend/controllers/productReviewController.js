const reviewService = require("../services/productReviewService");

// Create review
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = {
      productId,
      userId: req.user?._id || req.body.userId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const review = await reviewService.createReview(data);
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error: error.message });
  }
};

// Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(req.params.productId);
    res.status(200).json({ message: "Reviews retrieved successfully", reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// Get single review
const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch review", error: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const updated = await reviewService.updateReview(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review updated successfully", review: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const deleted = await reviewService.deleteReview(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};
