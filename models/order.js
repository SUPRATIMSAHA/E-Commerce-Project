const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  txnid: {
    type: String,
    require: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orderedProducts: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        min: 1,
        max: 10,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
