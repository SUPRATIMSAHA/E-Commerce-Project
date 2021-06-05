const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const isLoggedIn = require("../middleware/isLoggedIn");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/account", isLoggedIn, async (req, res) => {
  res.render("account/account");
});

router.get("/account/orders", isLoggedIn, async (req, res) => {
  try {
    if (req.user.orders.length) {
      const user = await User.findById(req.user._id).populate({
        path: "orders",
        populate: { path: "orderedProducts", populate: { path: "product" } },
      });

      res.render("account/orders", { orders: user.orders });
    } else {
      res.render("account/orders", { orders: req.user.orders });
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/products");
  }
});

router.patch("/account/userDetails/update", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.gender = req.body.gender;
    await user.save();
    console.log(user);
    req.flash("success", "Personal Details Updated Successfully");
    res.redirect("/account");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/account");
  }
});

router.patch("/account/phoneno/update", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.phoneno = req.body.phoneno;
    await user.save();
    req.flash("success", "Phone No. Updated Successfully");
    res.redirect("/account");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/account");
  }
});

router.patch("/account/address/update", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.address = req.body.address;
    await user.save();
    req.flash("success", "Address Updated Successfully");
    res.redirect("/account");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/account");
  }
});

router.get("/account/reset/password", isLoggedIn, (req, res) => {
  res.render("account/confirm");
});

router.post("/account/check/password", isLoggedIn, async (req, res) => {
  try {
    if (!req.user.validPassword(req.body.password)) {
      throw new Error("Password not matched.");
    } else {
      res.redirect(`/reset/password?email=${req.user.email}`);
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/account/reset/password");
  }
});

module.exports = router;
