const mongoose = require("mongoose");
const config = require("../config/config");

const DB_URL = config.dbUrl.url;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("mongodb atlas is connected");
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
