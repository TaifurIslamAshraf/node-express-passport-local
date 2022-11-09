const express = require("express");
const router = express.Router();
const { ensureAuthnticated } = require("../config/auth");

//Home Route
router.get("/", (req, res) => {
  res.render("index");
});

//dashboard
router.get("/dashboard", ensureAuthnticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name,
  });
});

module.exports = router;
