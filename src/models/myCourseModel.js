const mongoose = require("mongoose");

const myCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_id: {
    type:String,
    required: true,
  },
});

const MyCourse = mongoose.model("MyCourse", myCourseSchema);
module.exports = MyCourse;
