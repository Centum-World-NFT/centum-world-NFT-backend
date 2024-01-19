const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  text: {
    type: String,
  },
  replies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  nameOfUser: {
    type: String
  }
  // ... other properties for a reply
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.ObjectId,
    ref: "Video",
  },
  userId: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  replies: [replySchema], 
  nameOfUser: {
    type: String,
  },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
