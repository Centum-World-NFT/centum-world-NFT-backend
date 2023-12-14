const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");
const Subscriber = require("../models/subscriberModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Playlist = require("../models/playlistModel");
const {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} = require("../utilis/validation");
const ProfilePic = require("../models/profileModel");
const MyCourse = require("../models/myCourseModel");

exports.signupUser = async (req, res) => {
  try {
    const { firstName, surName, email, password, phone } = req.body;

    if (!firstName || !surName) {
      return res.status(422).json({
        status: false,
        message: "First Name and sur name both are required.",
      });
    }

    if (!email) {
      return res
        .status(422)
        .json({ status: false, message: "Email is required." });
    }

    if (!password) {
      return res
        .status(422)
        .json({ status: false, message: "Password is required." });
    }

    if (!phone) {
      return res
        .status(422)
        .json({ status: false, message: "Phone number is required." });
    }

    //validation
    if (!validateName(firstName)) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid First Name." });
    }
    if (!validateName(surName)) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Surname." });
    }
    if (!validateEmail(email)) {
      return res.status(422).json({ status: false, message: "Invalid Email." });
    }

    if (!validatePhone(phone)) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Phone number." });
    }

    if (!validatePassword(password)) {
      return res.status(422).json({
        status: false,
        message:
          "Invalid Password. Password should have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.",
      });
    }

    // Check if the provided email already exists in the database
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        status: false,
        message: "User already exist.",
      });
    }

    // Check if the provided phone number already exists in the database
    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(400).json({
        status: false,
        message: "User already exist.",
      });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const creator = await User.create({
      firstName,
      surName,
      email,
      phone,
      password: hashedPassword,
    });
    // Generate a JWT token upon successful registration
    const token = jwt.sign(
      { userId: creator._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      data: creator,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { emailorPhone, password } = req.body;

    if (!emailorPhone || !password) {
      return res.status(422).json({
        message: "Please provide email/phone  and password.",
      });
    }
    const user = await User.findOne({
      $or: [{ email: emailorPhone }, { phone: emailorPhone }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email/phone or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid email/phone or password.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      status: true,
      message: "User login successfully",
      token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// FetchAllDataToDashboard
exports.FetchAllDataToDashboard = async (req, res) => {
  try {
    const allData = await Playlist.find();
    if (!allData) {
      res.status(404).json({ message: "no frenchise found" });
    }
    res.status(200).json({
      status: true,
      message: "All Data fetched successfully",
      data: allData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "an erro occured",
      error: error.message,
    });
  }
};

// fetchAllVidhyamData
exports.fetchAllVidhyamData = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide Type" });
    }
    const vidhyamData = await Playlist.find({ key: "VIDHYAM" });
    if (!vidhyamData) {
      res.status(404).json({ status: false, message: "no data found" });
    }
    res.status(200).json({
      status: true,
      message: "Vidhyam data fetched successfully",
      data: vidhyamData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

exports.myCourse = async (req, res) => {
  try {
    const { userId, course_id, description, thumbnail, title, video,price } =
      req.body;

    const myCourse = await MyCourse.create({
      userId,
      course_id,
      description,
      thumbnail,
      title,
      video,
      price,
    });
    return res
      .status(200)
      .json({ status: true, message: "My course created succcessfully.", data:myCourse});
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

exports.fetchMyCourse = async (req, res) => {
  try {
    const { userId } = req.body;

    const myCourses = await MyCourse.find({ userId: userId });
    return res
      .status(200)
      .json({
        status: true,
        message: "My course fetched succcessfully.",
        data: myCourses,
      });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occured",
      error: error.message,
    });
  }
};
