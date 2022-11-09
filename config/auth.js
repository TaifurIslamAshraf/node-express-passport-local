const ensureAuthnticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Plase login to view this resource");
  res.redirect("/users/login");
};

const isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  }
  next();
};

module.exports = { ensureAuthnticated, isLogin };
