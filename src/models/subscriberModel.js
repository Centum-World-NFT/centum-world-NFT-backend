const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
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
  isBlocked: {
    type: Boolean,
    default: false
  }
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
