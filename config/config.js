require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 3000,
  },
  dbUrl: {
    url: process.env.MONGO_URL,
  },
};

module.exports = dev;
