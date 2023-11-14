const mongoose = require("mongoose");

const profilePicSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator", // Assuming your creator model is named "Creator"
    required: true,
  },
  profile_pic: {
    type: String,
    required: true,
  },
});

const ProfilePic = mongoose.model("ProfilePic", profilePicSchema);

module.exports = ProfilePic;
