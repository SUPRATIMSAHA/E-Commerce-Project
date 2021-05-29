const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();

router.get("/user/:id/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "cart",
      populate: { path: "product", populate: { path: "user" } },
    });
    res.render("cart/index", { userCart: user.cart, stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
  } catch (err) {
    req.flash("error", "Unable to Add this product");
    res.redirect("/products");
  }
});

router.post("/user/:id/cart", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = req.user;
    const isAdded = user.cart.find((item) =>
      item.product.equals(req.params.id)
    );
    if (!isAdded) {
      user.cart.push({ product, quantity: 1 });
      await user.save();
      req.flash("success", "Added to cart successfully");
      res.redirect(`/user/${req.user._id}/cart`);
    } else {
      req.flash("error", "You have already added this item in your cart");
      res.redirect(`/products/${req.params.id}`);
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/user/${req.user._id}/cart`);
  }
});

router.patch("/product/:id/quantity/decrease", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const product = user.cart.find((item) => item._id.equals(req.params.id));
    product.quantity--;
    await user.save();
    req.flash(
      "success",
      `You decrease the product quantity to ${product.quantity}`
    );
    res.redirect(`/user/${req.user._id}/cart`);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/user/${req.user._id}/cart`);
  }
});

router.patch("/product/:id/quantity/increase", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const product = user.cart.find((item) => item._id.equals(req.params.id));
    product.quantity++;
    await user.save();
    req.flash(
      "success",
      `You increase the product quantity to ${product.quantity}`
    );
    res.redirect(`/user/${req.user._id}/cart`);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/user/${req.user._id}/cart`);
  }
});

router.delete("/product/:id/cart/delete", async (req, res) => {
  try {
    const user = req.user;
    const result = await User.findById(user._id).populate({
      path: "cart",
      populate: { path: "product" },
    });
    const product = result.cart.find((item) => item._id.equals(req.params.id));
    const products = user.cart.filter(
      (item) => !item._id.equals(req.params.id)
    );
    user.cart = products;
    await user.save();
    req.flash(
      "success",
      `Successfully removed ${product.product.name} from your cart`
    );
    res.redirect(`/user/${req.user._id}/cart`);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/user/${req.user._id}/cart`);
  }
});

module.exports = router;
