const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
