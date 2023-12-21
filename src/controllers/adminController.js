const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const transactionHistory = require("../models/transactionHistoryModel"); // Adjust the path accordingly
const Creator = require("../models/creatorModel");
const MyCourse = require("../models/myCourseModel");

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
    const subscriberDetails = userDetails.map(user => ({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
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
      message: "User total Amount retrieved successfully",
      totalAmount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
