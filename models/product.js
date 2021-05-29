const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  price: {
    type: Number,
    min: 0,
  },
  desc: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
