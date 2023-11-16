const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  subscribe: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
