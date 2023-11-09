const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");
const bcrypt = require("bcrypt");

const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utilis/validation");
exports.signupCreator = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    email;
    if (!fullName) {
      return res
        .status(422)
        .json({ status: false, message: "Full Name is required" });
    }

    if (!email) {
      return res
        .status(422)
        .json({ status: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(422)
        .json({ status: false, message: "Password is required" });
    }

    if (!phone) {
      return res
        .status(422)
        .json({ status: false, message: "Phone number is required" });
    }


    //validation
    if (!validateName(fullName)) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Full Name" });
    }
    if (!validateEmail(email)) {
      return res.status(422).json({ status: false, message: "Invalid Email" });
    }

    if (!validatePassword(password)) {
      return res.status(422).json({
        status: false,
        message:
          "Invalid Password. Password should have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.",
      });
    }

    //if email exist
    const existEmail = await Creator.findOne({ email: email });

    if (existEmail) {
      return res.status(400).json({
        status: false,
        message:
          "This email is already in use. Please provide another email address.",
      });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const creator = await Creator.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });
    res.status(201).json({
      status: true,
      message: "Creator registered successfully",
      data: creator,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
