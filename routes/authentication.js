const express = require("express");
const passport = require("../utils/passport");
const User = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/user.gender.read",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  function (req, res) {
    req.flash("success", `${req.user.google.displayName} Welcome Back!!!`);
    res.redirect("/");
  }
);

router.get("/user/signup/", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("authentication/signup");
});

router.post("/user/signup", async (req, res) => {
  try {
    const newUser = new User();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.local.username = req.body.username;
    newUser.local.password = newUser.generateHash(req.body.password);
    newUser.email = req.body.email;
    newUser.gender = req.body.gender;
    newUser.phoneno = req.body.phoneno;
    await newUser.save();
    const token = new Token({
      _userId: newUser._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    let transporter = nodemailer.createTransport({
      service: "Sendgrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const data = await ejs.renderFile(
      __dirname + "/../views/template/email.ejs",
      {
        name: newUser.firstName,
        email: newUser.email,
        host: req.headers.host,
        token: token.token,
      }
    );
    let mailOptions = {
      from: "noreply.shopmycart@gmail.com",
      to: newUser.email,
      subject: "Account Verification Token",
      html: data,
    };
    await transporter.sendMail(mailOptions);
    req.flash(
      "success",
      "A verification email has been sent to " +
        newUser.email +
        ". Please verify you email and login."
    );
    res.redirect("/user/signin");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
});

router.get("/confirmation/:email/:token", async (req, res) => {
  try {
    // If we found a token, find a matching user
    const user = await User.findOne({ email: req.params.email });
    if (!user) throw new Error("We were unable to find a user for this token.");
    if (user.isVerified)
      throw new Error("This user has already been verified.");

    const token = await Token.findOneAndDelete({ token: req.params.token });
    if (!token)
      throw new Error(
        `We were unable to find a valid token. Your token may have expired. <a href="/verify/resend">Click here</a> to resend verification email.`
      );

    // Verify and save the user
    user.isVerified = true;
    await user.save();
    req.flash("success", "The account has been verified. Please log in.");
    res.redirect("/user/signin");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
});

router.get("/verify/resend", (req, res) => {
  res.render("authentication/resend");
});

router.post("/resend", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      throw new Error("We were unable to find a user with that email.");
    if (user.isVerified) {
      req.flash(
        "error",
        "This account has already been verified. Please log in."
      );
      return res.redirect("/user/signin");
    }

    // Create a verification token, save it, and send email
    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    // Save the token
    await token.save();

    // Send the email
    let transporter = nodemailer.createTransport({
      service: "Sendgrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const data = await ejs.renderFile(
      __dirname + "/../views/template/email.ejs",
      {
        name: user.firstName,
        email: user.email,
        host: req.headers.host,
        token: token.token,
      }
    );
    let mailOptions = {
      from: "noreply.shopmycart@gmail.com",
      to: user.email,
      subject: "Account Verification Token",
      html: data,
    };
    await transporter.sendMail(mailOptions);
    req.flash(
      "success",
      "A verification email has been sent to " +
        user.email +
        ". Please verify you email and login."
    );
    res.redirect("/user/signin");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/verify/resend");
  }
});

router.get("/user/signin/", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("authentication/signin");
});

router.post(
  "/user/signin",
  passport.authenticate("local", {
    failureRedirect: "/user/signin/",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `${req.user.local.username} Welcome Back!!!`);
    res.redirect("/");
  }
);

router.get("/user/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged Out Successfully");
  res.redirect("/user/signin");
});

router.get("/forgot/password", (req, res) => {
  res.render("account/forgotpassword");
});

router.post("/forgot/password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      throw new Error("We were unable to find a user with that email.");

    // Create a verification token, save it, and send email
    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    // Save the token
    await token.save();

    // Send the email
    let transporter = nodemailer.createTransport({
      service: "Sendgrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const data = await ejs.renderFile(
      __dirname + "/../views/template/password.ejs",
      {
        name: user.firstName,
        email: user.email,
        host: req.headers.host,
        token: token.token,
      }
    );
    let mailOptions = {
      from: "noreply.shopmycart@gmail.com",
      to: user.email,
      subject: "Password Reset Token",
      html: data,
    };
    await transporter.sendMail(mailOptions);
    req.flash(
      "success",
      "A verification email has been sent to " +
        user.email +
        ". Please verify you email and reset password."
    );
    res.redirect("/user/signin");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/forgot/password");
  }
});

router.get("/confirmation/password/:email/:token", async (req, res) => {
  try {
    // If we found a token, find a matching user
    const user = await User.findOne({ email: req.params.email });
    if (!user) throw new Error("We were unable to find a user for this token.");

    const token = await Token.findOneAndDelete({ token: req.params.token });
    if (!token)
      throw new Error(
        `We were unable to find a valid token. Your token may have expired. <a href="/forgot/password">Click here</a> to resend verification email.`
      );

    req.flash(
      "success",
      "The email has been verified. Now you can reset your password"
    );
    res.redirect(`/reset/password?email=${req.params.email}`);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signin");
  }
});

router.get("/reset/password", async (req, res) => {
  res.render("account/resetpassword", { email: req.query.email });
});

router.post("/reset/password", async (req, res) => {
  try {
    if (req.body.password !== req.body.confirm_password) {
      throw new Error("New password and confirm password does not match.");
    } else {
      const user = await User.findOne({ email: req.body.email });
      if (!user) throw new Error("We were unable to find a user.");
      user.local.password = user.generateHash(req.body.password);
      await user.save();
      req.flash("success", "Successfully updated the password.");
      if (req.user) {
        res.redirect("/account");
      } else {
        res.redirect("/user/signin");
      }
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/reset/password?email=${req.query.email}`);
  }
});

module.exports = router;
