const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//User module
const User = require("../models/user.model");

module.exports = async (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        //user match
        const emailLow = email.toLocaleLowerCase();
        await User.findOne({ email: emailLow })
          .then((user) => {
            if (!user) {
              done(null, false, { message: "This email is not register" });
            }

            //password match
            bcrypt.compare(password, user.password, async (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorect" });
              }
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    )
  );

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
