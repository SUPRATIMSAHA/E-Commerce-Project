const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  local: {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  google: {
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
    },
  },
  cart: [
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
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phoneno: {
    type: String,
  },
  address: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
