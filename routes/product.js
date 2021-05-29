const express = require("express");
const Product = require("../models/product");
const Review = require("../models/review");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();
const uploadImg = upload.single("img");

router.get("/products", async (req, res) => {
  const products = await Product.find({});

  res.render("products/index", { products });
});

router.get("/products/new", isLoggedIn, (req, res) => {
  res.render("products/new");
});

router.post("/products", (req, res) => {
  try {
    uploadImg(req, res, async (err) => {
      if (err) {
        req.flash("error", err);
        return res.redirect("/products/new");
      } else {
        const result = await cloudinary.uploader.upload(req.file.path, {
          upload_preset: "e_commerce",
        });
        const { name, price, desc } = req.body;
        const user = req.user._id;
        const img = result.secure_url;
        const cloudinary_id = result.public_id;
        await Product.create({ user, name, img, cloudinary_id, price, desc });
        req.flash("success", "Product Created Successfully");
        res.redirect("/products");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/products/new");
  }
});

router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("user")
    .populate({ path: "reviews", populate: { path: "user" } });

  res.render("products/show", { product, userReview: "" });
});

router.post("/products/:id/review", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user")
      .populate({ path: "reviews", populate: { path: "user" } });
    const isCommented = product.reviews.find((review) =>
      review.user._id.equals(req.user._id)
    );
    if (!isCommented) {
      const review = new Review({
        user: req.user._id,
        ...req.body,
      });
      product.reviews.push(review);
      await review.save();
      await product.save();
      req.flash("success", "Successfully added your review!");
      res.redirect(`/products/${req.params.id}`);
    } else {
      req.flash("error", "You have already added a review in this product");
      res.redirect(`/products/${req.params.id}`);
    }
  } catch (err) {
    console.log(err.message);
    req.flash("error", "Cannot add review to this Product");
    res.redirect(`/products/${req.params.id}`);
  }
});

router.get("/products/review/:id/edit", isLoggedIn, async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("user")
    .populate({ path: "reviews", populate: { path: "user" } });

  const userReview = product.reviews.find((review) =>
    review.user._id.equals(req.user._id)
  );

  res.render("products/show", { product, userReview });
});

router.patch(
  "/products/review/:productId/:reviewId",
  isLoggedIn,
  async (req, res) => {
    try {
      const review = await Review.findById(req.params.reviewId);
      if (req.user._id.equals(review.user)) {
        const data = {
          rating: req.body.rating || review.rating,
          comment: req.body.comment || review.comment,
        };
        await Review.findByIdAndUpdate(req.params.reviewId, data, {
          new: true,
        });
        req.flash("success", "Review Updated Successfully");
        res.redirect(`/products/${req.params.productId}`);
      } else {
        req.flash("error", "You are not authorized to edit this review.");
        res.redirect(`/products/${req.params.productId}`);
      }
    } catch (err) {
      req.flash("error", err.message);
      res.redirect(`/products/${req.params.id}/edit`);
    }
  }
);

router.delete(
  "/products/review/:productId/:reviewId/delete",
  isLoggedIn,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      const review = await Review.findById(req.params.reviewId);
      if (req.user._id.equals(review.user)) {
        const result = product.reviews.filter(
          (item) => !item.equals(review._id)
        );
        product.reviews = result;
        await product.save();
        await review.remove();
        req.flash("success", "Successfully Delete the Review");
        res.redirect(`/products/${req.params.productId}`);
      } else {
        req.flash("error", "You are not authorized to delete this review.");
        res.redirect(`/products/${req.params.productId}`);
      }
    } catch (err) {
      req.flash("error", err.message);
      res.redirect(`/products/${req.params.productId}`);
    }
  }
);

router.get("/products/:id/edit", isLoggedIn, async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.render("products/edit", { product });
});

router.patch("/products/:id", isLoggedIn, async (req, res) => {
  try {
    uploadImg(req, res, async (err) => {
      if (err) {
        req.flash("error", err);
        return res.redirect(`/products/${req.params.id}/edit`);
      } else {
        const product = await Product.findById(req.params.id);
        if (req.user._id.equals(product.user._id)) {
          await cloudinary.uploader.destroy(product.cloudinary_id);
          const result = await cloudinary.uploader.upload(req.file.path);
          const data = {
            name: req.body.name || product.name,
            img: result.secure_url || product.img,
            price: req.body.price || product.price,
            desc: req.body.desc || product.desc,
            cloudinary_id: result.public_id || product.cloudinary_id,
          };
          await Product.findByIdAndUpdate(req.params.id, data, { new: true });
          req.flash("success", "Product Updated Successfully");
          res.redirect(`/products/${req.params.id}`);
        } else {
          req.flash("error", "You are not authorized to edit this product.");
          res.redirect(`/products/${req.params.id}`);
        }
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/products/${req.params.id}/edit`);
  }
});

router.delete("/products/:id/delete", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (req.user._id.equals(product.user._id)) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
      await product.remove();
      req.flash("success", "Successfully Delete the Product");
      res.redirect("/products");
    } else {
      req.flash("error", "You are not authorized to delete this product.");
      res.redirect(`/products/${req.params.id}`);
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/products/${req.params.id}`);
  }
});

module.exports = router;
