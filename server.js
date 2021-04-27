const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
// const seedDB = require("./seed");
const productRoutes = require("./routes/product");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/ecomApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// seedDB();

app.get("/", (req, res) => {
  res.send("Landing Page");
});

app.use(productRoutes);

app.listen(3000, () => {
  console.log(`Server started at PORT ${PORT}`);
});
