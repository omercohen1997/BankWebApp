const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // remove any extra spaces from the username
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
