const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLogin } = require("../config/auth");

//register : Get
router.get("/register", (req, res) => {
  res.render("register");
});

//register : post
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check all feailds value required
    if (!name || !email || !password || !password2) {
      errors.push({ msg: "plase fill in all fields" });
    }

    //check password metch
    if (password !== password2) {
      errors.push({ msg: "password do not match" });
    }

    //check password length
    if (password.length < 6 && password.length > 0) {
      errors.push({ msg: "Password should be at last 6 cherecter" });
    }

    if (errors.length > 0) {
      res.render("register", {
        errors,
        name,
        email,
        password,
        password2,
      });
    } else {
      //valid pass
      await User.findOne({ email: email }).then((user) => {
        //check email exists
        if (user) {
          errors.push({ msg: "Email already exists" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
          });
        } else {
          bcrypt.hash(password, 10, async (err, hash) => {
            // Store hash in your password DB.
            const newUser = new User({
              name,
              email,
              password: hash,
            });

            await newUser
              .save()
              .then(() => {
                req.flash("success_msg", "You are registerd and can login");
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err.message);
              });
          });
        }
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login : get
router.get("/login", isLogin, (req, res) => {
  res.render("login");
});

//login : post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success_msg", "You are logged out");
      res.redirect("/users/login");
    }
  });
});

module.exports = router;
