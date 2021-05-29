const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const User = require("../models/user");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local",
  new LocalStrategy(function (username, password, done) {
    User.findOne({ "local.username": username }, function (err, user) {
      if (err) return done(null, false, { message: err.message });
      if (!user) return done(null, false, { message: "No user found." });

      if (!user.isVerified)
        return done(null, false, {
          message: `Pending Account. Please Verify Your Email! <a href="/verify/resend">Click here</a> to resend verification email.`,
        });

      if (!user.validPassword(password))
        return done(null, false, { message: "Oops! Wrong password." });

      return done(null, user);
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (request, accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ "google.googleId": profile.id }, function (err, user) {
          if (err) return done(err);

          if (user) {
            return done(null, user);
          } else {
            const newUser = new User();
            newUser.firstName = profile.name.givenName;
            newUser.lastName = profile.name.familyName;
            newUser.google.googleId = profile.id;
            newUser.google.displayName = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.isVerified = true;

            newUser.save(function (err) {
              if (err) return done(null, false, { message: err.message });
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

module.exports = passport;
