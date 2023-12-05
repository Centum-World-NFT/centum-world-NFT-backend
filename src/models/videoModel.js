const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String, 
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  pdf: {
    type: String, 
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const video = mongoose.model('video', videoSchema);

module.exports = video;
