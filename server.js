const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("./utils/passport");
// const seedDB = require("./seed");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// routes
const accountRoutes = require("./routes/account");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/authentication");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// seedDB();

const sessionConfig = {
  secret: "sachinisgodofcricketandiamgoingtomeethim",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use(accountRoutes);
app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);

app.listen(3000, () => {
  console.log(`Server started at PORT ${PORT}`);
});
