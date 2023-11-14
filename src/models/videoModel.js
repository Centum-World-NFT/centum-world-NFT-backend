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
  tag: {
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
});

const video = mongoose.model('video', videoSchema);

module.exports = video;
