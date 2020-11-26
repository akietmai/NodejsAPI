const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true, // để email này là duy nhất
    lowercase: true,
  },
  password: {
    type: String,
  },
  authGoogleID: {
    type: String,
    default: null,
  },
  authFacebookID: {
    type: String,
    default: null,
  },
  authType: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  decks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Deck",
    },
  ],
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.authType !== "local") next();

    // Generator a salt
    const salt = await bcrypt.genSalt(10);
    // Generator a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(this.password, salt);
    // Re-assign password hashed
    this.password = passwordHashed;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("User", UserSchema);
