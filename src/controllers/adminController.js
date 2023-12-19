const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/adminModel');
const User = require("../models/userModel");
const transactionHistory = require('../models/transactionHistoryModel'); // Adjust the path accordingly

exports.adminLogin = async(req,res) => {
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
}


//All user count

exports.getAllUsersCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.status(200).json({
      status: true,
      message: "User count retrieved successfully",
      data: {
        userCount: userCount,
      },
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
    const totalAmount = transactions.reduce((acc, transactions) => acc + parseInt(transactions.price), 0);
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
