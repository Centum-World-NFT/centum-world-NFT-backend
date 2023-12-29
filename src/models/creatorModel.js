const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema(
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
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    profile_pic: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Creator = mongoose.model("Creator", creatorSchema);
module.exports = Creator;
