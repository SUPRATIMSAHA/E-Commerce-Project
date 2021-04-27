const express = require("express");
const Product = require("../models/product");
const router = express.Router();

router.get("/products", async (req, res) => {
  const products = await Product.find({});

  res.render("products/index", { products });
});

router.get("/products/new", (req, res) => {
  res.render("products/new");
});

router.post("/products", async (req, res) => {
  await Product.create(req.body.product);

  res.redirect("/products");
});

router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.render("products/show", { product });
});

router.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.render("products/edit", { product });
});

router.patch("/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body.product);

  res.redirect(`/products/${req.params.id}`);
});

router.delete("/products/:id", async (req, res) => {
  console.log(req.params.id);
  await Product.findByIdAndDelete(req.params.id);

  res.redirect("/products");
});

module.exports = router;
