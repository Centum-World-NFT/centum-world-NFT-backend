const Video = require("../models/videoModel");

exports.uploadVideo = async (req, res) => {
    try {
      const { title, tag, description } = req.body;
  
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
      const thumbnailFileLoction = req.files["thumbnail"][0].location;
      const pdfFileLocation = req.files["pdf"][0].location;
  
      // Create a new Video instance with correct values
      const createdVideo = await Video.create({
        video: videoFileLocation,
        pdf: pdfFileLocation,
        thumbnail: thumbnailFileLoction,
        title,
        description,
        tag,
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
  
  