const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const transactionHistory = require("../models/transactionHistoryModel"); // Adjust the path accordingly
const Creator = require("../models/creatorModel");
const MyCourse = require("../models/myCourseModel");
const Playlist = require("../models/playlistModel");

exports.adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res
        .status(422)
        .json({ message: "Please fill credentials to login" });
    }
    const adminLogin = await Admin.findOne({ adminId: adminId });

    //console.log(adminLogin);
    if (!adminLogin) {
      res.status(404).json({ message: "Invalid Credentials" });
    } else {
      if (password === adminLogin.password) {
        const token = jwt.sign(
          { adminId: adminLogin._id, role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );
        const adminId = adminLogin.adminId;
        // const referralId = adminLogin.referralId;
        res.status(201).json({
          message: "Admin Login Successfully",
          token: token,
          adminId,
          expires: new Date().getTime() + 60000,
        });
      } else {
        return res.status(404).json({ error: "Invalid Credentials" });
      }
    }
  } catch (error) {
    console.log(error);
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
    const playlists = await Playlist.find();

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
