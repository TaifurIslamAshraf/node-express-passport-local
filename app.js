const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const app = express();

const DB_URL = require("./config/config").dbUrl.url;

//Passport
require("./config/passport")(passport);

//Database connect
require("./config/database");

//EJS
app.use(expressLayout);
app.set("view engine", "ejs");

//Express session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: DB_URL,
      collectionName: "session",
    }),
    //   cookie: { secure: true }
  })
);

//Passport midelware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routers
app.use("/", require("./routers/index"));
app.use("/users", require("./routers/user.route"));

//Router Error
app.use("*", (req, res, next) => {
  res.status(404).render("error");
});

//Server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "somthing broke",
  });
  console.log(err.message);
});

module.exports = app;
