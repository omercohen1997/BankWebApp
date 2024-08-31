const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },

  balance: {
    type: Number,
    required: true,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
  },
  
  verificationCodeExpiresAt: {
    type: Date,
  },

  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user'
  }

}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
