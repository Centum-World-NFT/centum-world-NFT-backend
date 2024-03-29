const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const transactionHistory = require("../models/transactionHistoryModel"); // Adjust the path accordingly
const Creator = require("../models/creatorModel");
const MyCourse = require("../models/myCourseModel");
const Playlist = require("../models/playlistModel");
const Video = require("../models/videoModel");

exports.adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res
        .status(422)
        .json({
          status: false,
          message: "Please provide both adminId and password to login",
        });
    }

    const adminLogin = await Admin.findOne({ adminId });

    if (!adminLogin) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const isPasswordValid = password === adminLogin.password;

    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: adminLogin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "Admin Login Successfully",
        token,
        adminId: adminLogin._id,
        expires: new Date().getTime() + 60000,
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//All user count

exports.getAllUsersCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.status(200).json({
      status: true,
      message: "User count retrieved successfully",
      userCount,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//All creator count

exports.getAllCreatorCount = async (req, res) => {
  try {
    const creatorCount = await Creator.countDocuments();

    res.status(200).json({
      status: true,
      message: "Creator count retrieved successfully",
      creatorCount,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get all creator details
exports.getAllCreators = async (req, res) => {
  try {
    const creators = await Creator.find();

    res.status(200).json({
      status: true,
      message: "All creators retrieved successfully",
      creators,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//total subscriber count
exports.getAllSubscriberCount = async (req, res) => {
  try {
    const uniqueUserIds = await MyCourse.distinct("userId");
    const subscriberCount = uniqueUserIds.length;
    res.status(200).json({
      status: true,
      message: "Subscriber count retrieved successfully",
      subscriberCount,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//total subscriber details
exports.getSubscriberDetails = async (req, res) => {
  try {
    const uniqueUserIds = await MyCourse.distinct("userId");
    const userDetails = await User.find({ _id: { $in: uniqueUserIds } });
    const subscriberDetails = userDetails.map((user) => ({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.surName,
      email: user.email,
      phone: user.phone,
      isBlocked: user.isBlocked,
      isDeleted: user.isDeleted,
      profile_pic: user.profile_pic,
      isVerified: user.isVerified,
    }));

    res.status(200).json({
      status: true,
      message: "Subscriber details retrieved successfully",
      subscriberDetails,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// totalAmount.controller.js
exports.getTotalAmount = async (req, res) => {
  try {
    const transactions = await transactionHistory.find();
    const totalAmount = transactions.reduce(
      (acc, transactions) => acc + parseInt(transactions.price),
      0
    );
    res.status(200).json({
      status: true,
      message: "total Amount retrieved successfully",
      totalAmount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//get every month revenue

exports.getEveryMonthRevenue = async (req, res) => {
  try {
    const revenuePerMonth = await MyCourse.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return res.json({
      status: true,
      message: "Every month revenue fetched successfully",
      data: revenuePerMonth,
    });
  } catch (error) {
    console.error("Error in getEveryMonthRevenue:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//get every month subscriber
exports.getEveryMonthPaidUserCount = async (req, res) => {
  try {
    const perMonthUserCount = await MyCourse.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          userCount: { $size: "$uniqueUsers" },
        },
      },

      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    return res.json({
      status: true,
      message: "Unique monthly user count fetched successfully",
      data: perMonthUserCount,
    });
  } catch (error) {
    console.error("Error in getEveryMonthPaidUser:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//fetch transaction history of all subscribers

exports.fetchTransactionHistoryForAllUsers = async (req, res) => {
  try {
    const transactionHistories = await transactionHistory.find();
    if (transactionHistories.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Transaction histories not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Transaction history fetched successfully",
      data: transactionHistories,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get all user details
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: true,
      message: "All users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//getPlaylist of creator with creator ID
exports.getPlayListOfCreator = async (req, res) => {
  const { id } = req.params;
  try {
    const playlistDetails = await Playlist.find({ creatorId: id });
    res.status(200).json({
      status: true,
      message: "playlist fetched successfully",
      data: playlistDetails,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.blockAndUnblockUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: isBlocked },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const action = isBlocked ? "blocked" : "unblocked";

    res.status(200).json({
      status: true,
      message: `User successfully ${action}`,
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isDeleted } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: isDeleted },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const action = isDeleted ? "deleted" : "recovered";

    res.status(200).json({
      status: true,
      message: `User successfully ${action}`,
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.fetchPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("creatorId");

    if (playlists.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No playlist found" });
    }

    return res.status(200).json({
      status: true,
      message: "Playlist fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.blockAndUnblockCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { isBlocked } = req.body;
    const creator = await Creator.findByIdAndUpdate(
      { _id: creatorId },
      { isBlocked: isBlocked },
      { new: true }
    );
    if (!creator) {
      return res.status(404).json({ error: "Creator not found." });
    }
    res.status(200).json({
      message: `Creator successfully ${isBlocked ? "blocked" : "unblocked"} `,
      data: creator,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.deleteCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { isDeleted } = req.body;
    const creator = await Creator.findByIdAndUpdate(
      { _id: creatorId },
      { isDeleted: isDeleted },
      { new: true }
    );
    if (!creator) {
      res.status(404).json({ message: "creator not found" });
    }

    const action = isDeleted ? "deleted" : "recovered";
    res
      .status(200)
      .json({ message: `Creator successfully ${action}`, data: creator });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//fetch playlist using subscriber's userId
exports.fetchSubscriberCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const courses = await MyCourse.find({ userId: id });
    return res.status(200).json({
      status: true,
      message: "Subscriber course fetched succcessfully.",
      data: courses,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "An error occured",
      error: error.message,
    });
  }
};
exports.everyMonthNumberOfNewUsersAndNewSubscribers = async (req, res) => {
  try {
    const aggregationPipeline = [
      {
        $project: {
          formattedCreatedAt: {
            $cond: {
              if: { $eq: [{ $type: "$createdAt" }, "date"] },
              then: "$createdAt",
              else: {
                $dateFromString: {
                  dateString: "$createdAt",
                },
              },
            },
          },
          isSubscriber: 1,
        },
      },
      {
        $project: {
          year: { $year: "$formattedCreatedAt" },
          month: { $month: "$formattedCreatedAt" },
          isSubscriber: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalNewUsers: { $sum: 1 },
          newSubscribers: {
            $sum: { $cond: [{ $eq: ["$isSubscriber", true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the output
          year: "$_id.year",
          month: {
            $cond: {
              if: { $lt: ["$_id.month", 10] },
              then: { $concat: ["0", { $toString: "$_id.month" }] },
              else: { $toString: "$_id.month" },
            },
          },
          totalNewUsers: 1,
          newSubscribers: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ];

    const monthlyStats = await User.aggregate(aggregationPipeline);

    res.json({
      status: true,
      message:
        "Monthly statistics of new users and new subscribers retrieved successfully.",
      data: monthlyStats,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.fetchVideosByCourseId = async (req, res) => {
  try {
    const { id } = req.params;
    const videos = await Video.find({ course_id: id });
    if (videos.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No videos found for the specified course_id",
      });
    }
    res.status(200).json({
      status: true,
      message: "videos fetched successfully for specific course id",
      data: videos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyCreator = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCreator = await Creator.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!updatedCreator) {
      return res
        .status(404)
        .json({ status: false, message: "Creator not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Creator verified successfully",
      data: updatedCreator,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.verifySubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSubscriber = await User.findOneAndUpdate(
      { _id: id, isSubscriber: true },
      { isVerified: true },
      { new: true }
    );

    if (!updatedSubscriber) {
      return res
        .status(404)
        .json({ status: false, message: "Subscriber not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Subscriber verified successfully",
      data: updatedSubscriber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.totalCourses = async (req, res) => {
  try {
    const coursesCount = await Playlist.find().count();

    res.status(200).json({
      status: true,
      data: {
        totalCourses: coursesCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.mostPurchasedCourse = async (req, res) => {
  try {
    // Getting the most-purchased course title name and the number of purchases
    const mostPurchased = await MyCourse.aggregate([
      {
        $group: {
          _id: "$title",
          count: { $sum: 1 },
          price: { $first: "$price" },
          uniqueId: { $first: "$_id" },
          creatorId: { $first: "$creatorId" },
          courseId: { $first: "$course_id" },
          thumbnail: { $first: "$thumbnail" },
          previewVideo: { $first: "$video" },
        },
      },

      {
        $lookup: {
          from: "creators",
          localField: "creatorId",
          foreignField: "_id",
          as: "creatorInfo",
        },
      },
      {
        $unwind: "$creatorInfo",
      },

      {
        $project: {
          _id: 1,
          count: 1,
          price: 1,
          creatorName: {
            $concat: ["$creatorInfo.firstName", " ", "$creatorInfo.surName"],
          },
          uniqueId: 1,
          courseId: 1,
          thumbnail: 1,
          previewVideo: 1,
        },
      },

      {
        $sort: { count: -1 },
      },
    ]);

    const bestCourse = mostPurchased[0];

    let rank = 0;

    mostPurchased.forEach((course, index) => {
      course.rank = index + 1;
    });

    res.status(200).json({
      status: true,
      data: { mostPurchased, bestCourse },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
