const User = require("../models/User");
const Deck = require("../models/Deck");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../configs/index");
const encodedToken = (userID) => {
  return JWT.sign(
    {
      iss: "Anh Kiet",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3), // Hết hạn sau 3 ngày
    },
    JWT_SECRET
  );
};

// Promise way
// const index = (req, res, next) => {
//   User.find({})
//     .then(users => {
//       return res.status(200).json({users})
//     })
//     .catch(err => next(err))
// }
// const newUser = (req, res, next) => {
//   console.log('req.body content', req.body)
//   // create object model
//   const newUser = new User(req.body)
//   newUser.save()
//     .then(users => {
//       console.log('User save ', newUser);
//       return res.status(201).json({users})
//     })
//     .catch(err => next(err))
// }

// Async/Await

const authGoogle = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader("Authorization", token);
  return res.status(200).json({ success: true });
};

const getUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID);
  return res.status(200).json({ user });
};

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params;

  // Get User
  const user = await User.findById(userID).populate("decks");

  return res.status(200).json({ decks: user.decks });
};

const index = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({ users });
};

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);
  await newUser.save();
  return res.status(201).json({ users: newUser });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;

  // create a new deck
  const newDeck = new Deck(req.body);

  // get User
  const user = await User.findById(userID);

  // Assign user as a deck's owner
  newDeck.owner = user;

  // Save the deck
  await newDeck.save();

  // Add deck to user's decks array 'decks'
  user.decks.push(newDeck._id);

  // Save the user
  await user.save();

  return res.status(201).json({ newDeck });
};

const secret = async (req, res, next) => {
  return res.status(200).json({ resources: true });
};

const signIn = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader("Authorization", token);
  return res.status(200).json({ success: true });
};

const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body;

  // check if there is a user with the same email
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res
      .status(403)
      .json({ error: { message: "Email is already in use." } });
  }

  // create new user
  const newUser = new User({ firstName, lastName, email, password });
  newUser.save();

  // encode a token
  const token = encodedToken(newUser._id);

  res.setHeader("Authorization", token);
  return res.status(201).json({ success: true });
};

const replaceUser = async (req, res, next) => {
  // enforce new user to old user
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true });
};

const updateUser = async (req, res, next) => {
  // number of fields
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true });
};

module.exports = {
  authGoogle,
  getUser,
  getUserDecks,
  index,
  newUser,
  newUserDeck,
  secret,
  signIn,
  signUp,
  replaceUser,
  updateUser,
};
