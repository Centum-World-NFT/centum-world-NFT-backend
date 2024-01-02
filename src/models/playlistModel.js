const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
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

},{timestamps:true});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
