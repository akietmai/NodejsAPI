const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName : {
    type : String
  },
  lastName : {
    type : String
  },
  email : {
    type : String,
    required : true,
    unique : true, // để email này là duy nhất
    lowercase : true

  },
  password : {
    type : String,
    required : true
  },
  decks : [{
    type : Schema.Types.ObjectId,
    ref : 'Deck'
  }]
})

module.exports = mongoose.model('User',UserSchema)