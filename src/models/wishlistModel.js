const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  playlist_title: {
    type: String,
    required: true,
  },
  playlist_description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  playlist_thumbnail: {
    type: String,
    required: true,
  },
  preview_video: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    required :true,
    unique: true,
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
