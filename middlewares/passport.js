const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("../configs/index");

const User = require("../models/User");

// passport-jwt
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);

        if (!user) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// passport google
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID:
        "699003989578-3epuqje19uojn6uf45kaoeovhqnr5sfe.apps.googleusercontent.com",
      clientSecret: "o-9TTNK9tr9_H670MZtEBD3g",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token : ", accessToken);
        console.log("Refresh Token : ", refreshToken);
        console.log("Profile : ", profile);

        // check whether this current user exists in our database
        const user = await User.findOne({
          authGoogleID: profile.id,
          authType: "google",
        });

        if (user) return done(null, user);

        // if new user
        const newUser = new User({
          authType: "google",
          authGoogleID: profile.id,
          email: profile.emails[0].value,
        });

        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// passport-local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) return done(null, false);

        const isCorrectPassword = await user.isValidPassword(password);

        if (!isCorrectPassword) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
