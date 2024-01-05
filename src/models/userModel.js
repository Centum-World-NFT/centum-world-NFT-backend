// user.js (model)

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    surName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "", // Set a default or placeholder value
    },
    password: {
      type: String,
      default: "", // Set a default or placeholder value
    },
    profile_pic: {
      type: String,
      default: "", // Set a default or placeholder value
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isSubscriber: {
      type: Boolean,
      default: false,
    },
    joinDate: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
