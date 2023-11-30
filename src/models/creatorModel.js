const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
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
  role: {
    type: String,
    required: true,
    enum: ["creator", "user"],
  },

  bio: {
    type: String,
  },
});

const Creator = mongoose.model("Creator", creatorSchema);
module.exports = Creator;
