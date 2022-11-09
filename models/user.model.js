const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "plase enter your name"],
  },
  email: {
    type: String,
    required: [true, "plase enter your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "plase enter your password"],
  },
  createOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("users", userSchema);
