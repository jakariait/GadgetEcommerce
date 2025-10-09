const mongoose = require("mongoose");

const productReviewModel = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("ProductReview", productReviewModel);
