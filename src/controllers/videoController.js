const Playlist = require("../models/playlistModel");
const Video = require("../models/videoModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Creator = require("../models/creatorModel");

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, creatorId, key, course_id } = req.body;

    if (!req.files["video"]) {
      return res.status(400).json({ message: "Video file is missing." });
    }

    if (!req.files["thumbnail"]) {
      return res.status(400).json({ message: "Thumbnail file is missing." });
    }

    if (!req.files["pdf"]) {
      return res.status(400).json({ message: "Pdf file is missing." });
    }

    // Get file locations
    const videoFileLocation = req.files["video"][0].location; // Assuming you are storing file paths or URLs in your model
    console.log("========>", videoFileLocation);
    const thumbnailFileLoction = req.files["thumbnail"][0].location;
    console.log("========>", thumbnailFileLoction);
    const pdfFileLocation = req.files["pdf"][0].location;
    console.log("========>", pdfFileLocation);

    const existingCourseIdInPlaylist = await Playlist.findOne({ course_id });

    if (!existingCourseIdInPlaylist) {
      return res
        .status(400)
        .json({ status: false, message: "You are providing wrong course Id" });
    }

    // Create a new Video instance with correct values
    const createdVideo = await Video.create({
      video: videoFileLocation,
      pdf: pdfFileLocation,
      thumbnail: thumbnailFileLoction,
      title,
      description,
      creatorId,
      key,
      course_id,
    });

    res.status(201).json({
      status: true,
      message: "Video uploaded successfully",
      data: createdVideo,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.fetchVideo = async (req, res) => {
  try {
    const { videoId } = req.body;

    // Find the video by ID in the database
    const video = await Video.findById(videoId);

    // Check if the video with the given ID exists
    if (!video) {
      return res
        .status(404)
        .json({ status: false, message: "Video not found" });
    }

    // Respond with the video data
    res.status(200).json({
      status: true,
      data: video,
    });
  } catch (error) {
    // Handle errors and respond with an internal server error message
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.fetchOneCreatorVideos = async (req, res) => {
  try {
    const { id } = req.body; // Change 'creatorId' to 'id'

    // Find the video by ID in the database
    const videos = await Video.find({ creatorId: id }); // Use 'id' instead of 'creatorId'

    // Check if the video with the given ID exists
    if (!videos) {
      return res
        .status(404)
        .json({ status: false, message: "Video not found" });
    }

    // Respond with the video data
    res.status(200).json({
      status: true,
      data: videos,
    });
  } catch (error) {
    // Handle errors and respond with an internal server error message
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.selectVideo = async (req, res) => {
  try {
    const { id } = req.body;

    const videoToSelect = await Video.findOneAndUpdate(
      { _id: id },
      { isSelected: true },
      { new: true }
    );

    if (!videoToSelect) {
      return res
        .status(404)
        .json({ status: false, message: "Video not found" });
    }

    // Respond with the updated video
    res
      .status(200)
      .json({ status: true, message: "Video selected", video: videoToSelect });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.user;

    console.log(userId);

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Check if the user has already liked the video
    const hasLiked = video.likes.includes(userId);

    if (hasLiked) {
      // If the user has already liked, remove the like
      video.likes.pull(userId);
    } else {
      // If the user hasn't liked, add the like
      video.likes.push(userId);
    }

    // Save the updated video
    const updatedVideo = await video.save();

    return res.status(200).json({
      message: hasLiked
        ? "The like has been removed"
        : "The video has been liked",
      data: updatedVideo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.dislikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.user;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: { dislikes: userId },

        $pull: { likes: userId },
      },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const hasDisliked = video.dislikes.includes(userId);
    if (hasDisliked) {
      // If the user has already liked, remove the like
      video.dislikes.pull(userId);
    } else {
      // If the user hasn't liked, add the like
      video.dislikes.push(userId);
    }

    const updatedVideo = await video.save();

    return res.status(200).json({
      message: hasDisliked
        ? "The dislike has been removed"
        : "The video has been disliked",
      data: updatedVideo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//add a comment
exports.addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const { userId } = req.user;

    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ status: false, message: "Video not found" });
    }

    // Get the user and their name
    const user =
      (await User.findById(userId)) || (await Creator.findById(userId));
    const nameOfUser = user
      ? user.firstName + " " + user.surName
      : "Unknown User";

    // Create a new comment with the user's name
    const newComment = new Comment({
      videoId,
      userId,
      text,
      nameOfUser,
    });

    const savedComment = await newComment.save();

    video.comments.push(userId);
    await video.save();

    res.status(201).json({ status: true, data: savedComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.addReplyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.user;
    const { text } = req.body;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }
    // Get the user and their name
    const user =
      (await User.findById(userId)) || (await Creator.findById(userId));
    const nameOfUser = user
      ? user.firstName + " " + user.surName
      : "Unknown User";

    const newReply = new Comment({
      userId,
      text,
      nameOfUser,
    });

    const savedReply = await newReply.save();
    parentComment.replies.push(savedReply);
    await parentComment.save();

    res.status(201).json({ status: true, data: savedReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ videoId });
    return res.status(200).json({ status: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }

    // Extract replies from the comment or set to an empty array if not present
    const replies = comment.replies || [];

    return res.status(200).json({ status: true, data: replies });
  } catch (error) {
    console.error("Error fetching replies:", error);

    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
