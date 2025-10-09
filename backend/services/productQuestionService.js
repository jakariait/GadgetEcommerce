const ProductQuestion = require("../models/ProductQuestionModel");

// Create question
const createQuestion = async (data) => {
  const question = new ProductQuestion(data);
  return question.save();
};

// Get all questions for a product
const getQuestionsByProduct = async (productId) => {
  return ProductQuestion.find({ productId })
    .populate("userId", "name email fullName")
    .sort({ createdAt: -1 });
};

// Get single question
const getQuestionById = async (id) => {
  return ProductQuestion.findById(id)
    .populate("userId", "name email")
};

// Update / Answer question
const updateQuestion = async (id, updateData) => {
  return ProductQuestion.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete question
const deleteQuestion = async (id) => {
  return ProductQuestion.findByIdAndDelete(id);
};

// Export all service functions
module.exports = {
  createQuestion,
  getQuestionsByProduct,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
