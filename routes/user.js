const express = require("express");
// const router = express.Router()
const router = require("express-promise-router")();

const UserController = require("../controllers/user");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routeHelper");

const passport = require("passport");
require("../middlewares/passport");

router
  .route("/")
  .get(UserController.index)
  .post(validateBody(schemas.userSchema), UserController.newUser);

router
  .route("/auth/google")
  .post(
    passport.authenticate("google-plus-token", { session: false }),
    UserController.authGoogle
  );

router
  .route("/secret")
  .get(passport.authenticate("jwt", { session: false }), UserController.secret);

router
  .route("/signin")
  .post(
    validateBody(schemas.authSignInSchema),
    passport.authenticate("local", { session: false }),
    UserController.signIn
  );

router
  .route("/signup")
  .post(validateBody(schemas.authSignUpSchema), UserController.signUp);

router
  .route("/:userID")
  .get(validateParam(schemas.idSchema, "userID"), UserController.getUser)
  .put(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userSchema),
    UserController.replaceUser
  )
  .patch(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userOptionalSchema),
    UserController.updateUser
  );

router
  .route("/:userID/decks")
  .get(validateParam(schemas.idSchema, "userID"), UserController.getUserDecks)
  .post(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.deckSchema),
    UserController.newUserDeck
  );

module.exports = router;
