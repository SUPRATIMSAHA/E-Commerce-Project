const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Need to Login First");
    return res.redirect("/user/signin");
  }
  next();
};

module.exports = isLoggedIn;
