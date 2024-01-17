// models/commentModel.js

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // Define your schema properties here
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
  replies: [
    {
      type: String,
      
    },
  ],
  nameOfUser : {
    type:String
  }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
