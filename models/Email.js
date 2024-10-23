const { ObjectId } = require('bson');
const mongoose = require('mongoose');

// Define the Email schema
const emailSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,  // Automatically add the timestamp when the email is sent
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  }
});

// Create the Email model based on the schema
const email = mongoose.model('email', emailSchema);

module.exports = email;

