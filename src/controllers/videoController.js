const Video = require("../models/videoModel");

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description , creatorId} = req.body;

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

    // Create a new Video instance with correct values
    const createdVideo = await Video.create({
      video: videoFileLocation,
      pdf: pdfFileLocation,
      thumbnail: thumbnailFileLoction,
      title,
      description,
      creatorId
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
    const videos = await Video.find({creatorId:id}); // Use 'id' instead of 'creatorId'

    // Check if the video with the given ID exists
    if (!videos) {
      return res.status(404).json({ status: false, message: "Video not found" });
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
     {_id: id},
      { isSelected: true },
      { new: true } 
    );

    if (!videoToSelect) {
      return res.status(404).json({ status: false, message: "Video not found" });
    }

    // Respond with the updated video
    res.status(200).json({ status: true, message: "Video selected", video: videoToSelect });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
