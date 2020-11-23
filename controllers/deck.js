const User = require("../models/User");
const Deck = require("../models/Deck");

// Async/Await
const deleteDeck = async (req, res, next) => {
  const { deckID } = req.value.params;

  // get a deck
  const deck = await Deck.findById(deckID);
  const ownerID = deck.owner;

  // get a owner
  const owner = await User.findById(ownerID);

  // remove a deck
  await deck.remove();

  // Remove deck from owner's decks list
  owner.decks.pull(deck);
  await owner.save();

  return res.status(200).json({ success: true });
};

const getDeck = async (req, res, next) => {
  const deckID = await Deck.findById(req.value.params.deckID);

  return res.status(200).json({ deckID });
};

const index = async (req, res, next) => {
  console.log(Math.max());
  const decks = await Deck.find({});

  return res.status(200).json({ decks });
};

const newDeck = async (req, res, next) => {
  // find owner
  const owner = await User.findById(req.value.body.owner);

  // create a new deck
  const deck = req.value.body;
  delete deck.owner;

  deck.owner = owner._id;
  const newDeck = new Deck(deck);
  await newDeck.save();

  // Add newly created deck to the actual decks
  owner.decks.push(newDeck._id);
  await owner.save();

  return res.status(201).json({ decks: newDeck });
};

const replaceDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckID, newDeck);

  // check if put user, remove deck in user's model

  return res.status(200).json({ success: true });
};

const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckID, newDeck);

  return res.status(200).json({ success: true });
};

module.exports = {
  deleteDeck,
  getDeck,
  index,
  newDeck,
  replaceDeck,
  updateDeck,
};
