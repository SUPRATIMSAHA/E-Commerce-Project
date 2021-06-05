const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "cart",
    populate: { path: "product", populate: { path: "user" } },
  });
  let line_items = [];
  for (let item of user.cart) {
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
        },
        unit_amount: parseInt(item.product.price) * 100,
      },
      quantity: item.quantity,
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    success_url: `http://${req.headers.host}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://${req.headers.host}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });
  res.json({ id: session.id });
});

router.post("/buy/create-checkout-session", isLoggedIn, async (req, res) => {
  const product = await Product.findById(req.body.id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: parseInt(product.price) * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://${req.headers.host}/buy/payment/success?session_id={CHECKOUT_SESSION_ID}&product=${req.body.id}`,
    cancel_url: `http://${req.headers.host}/buy/payment/cancel?session_id={CHECKOUT_SESSION_ID}&product=${req.body.id}`,
  });
  res.json({ id: session.id });
});

router.get("/payment/success", isLoggedIn, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    const customer = await stripe.customers.retrieve(session.customer);
    const user = req.user;
    const order = {
      txnid: session.payment_intent,
      price: session.amount_subtotal,
      orderedProducts: user.cart,
    };
    const placedOrder = await Order.create(order);
    user.orders.push(placedOrder);
    user.cart = [];
    await user.save();

    req.flash("success", "Payment Successful.");
    res.redirect("/account/orders");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/account/orders");
  }
});

router.get("/payment/cancel", isLoggedIn, (req, res) => {
  const user = req.user;
  req.flash("error", "Some error occurred. Payment not successful.");
  res.redirect(`/user/${user._id}/cart`);
});

router.get("/buy/payment/success", isLoggedIn, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    const customer = await stripe.customers.retrieve(session.customer);
    const user = req.user;
    const order = {
      txnid: session.payment_intent,
      price: session.amount_subtotal,
      orderedProducts: {
        product: req.query.product,
        quantity: 1,
      },
    };
    const placedOrder = await Order.create(order);
    user.orders.push(placedOrder);
    await user.save();

    req.flash("success", "Payment Successful.");
    res.redirect("/account/orders");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/account/orders");
  }
});

router.get("/buy/payment/cancel", isLoggedIn, (req, res) => {
  const user = req.user;
  req.flash("error", "Some error occurred. Payment not successful.");
  res.redirect(`/user/${user._id}/cart`);
});

module.exports = router;
