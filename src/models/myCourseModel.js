const mongoose = require("mongoose");

const myCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  price: {
    type:Number,
    required: true
  },

},{timestamps: true} );

const MyCourse = mongoose.model("MyCourse", myCourseSchema);
module.exports = MyCourse;
