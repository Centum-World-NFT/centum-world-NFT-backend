const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");
const Subscriber = require("../models/subscriberModel");
const bcrypt = require("bcrypt");

const {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} = require("../utilis/validation");
const ProfilePic = require("../models/profileModel");

exports.signupCreator = async (req, res) => {
  try {
    const { firstName, surName, email, password, phone } = req.body;

    if (!firstName || !surName) {
      return res
        .status(422)
        .json({
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
    const existingEmail = await Creator.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        status: false,
        message:
          "This email is already in use. Please provide another email address.",
      });
    }

    // Check if the provided phone number already exists in the database
    const existingPhone = await Creator.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(400).json({
        status: false,
        message:
          "This phone number is already in use. Please provide another phone number.",
      });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const creator = await Creator.create({
      firstName,
      surName,
      email,
      phone,
      password: hashedPassword,
    });
    // Generate a JWT token upon successful registration
    const token = jwt.sign(
      { userId: creator._id, role: "creator" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      status: true,
      message: "Creator registered successfully",
      token,
      data: creator,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.creatorLogin = async (req, res) => {
  try {
    const { emailorPhone, password } = req.body;

    if (!emailorPhone || !password) {
      return res.status(422).json({
        message: "Please provide email/phone  and password.",
      });
    }
    const creator = await Creator.findOne({
      $or: [{ email: emailorPhone }, { phone: emailorPhone }],
    });
    if (!creator) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email/phone or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, creator.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid email/phone or password.",
      });
    }

    const token = jwt.sign(
      { userId: creator._id, role: "creator" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({
      status: true,
      message: "Creator login succesfully",
      token,
      data: creator,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Import necessary modules and models

exports.updateCreator = async (req, res) => {
  try {
    const { firstName, surName, email, phone, creatorId } = req.body;

    // Check for required fields
    if (!firstName || !surName || !email || !phone) {
      return res
        .status(422)
        .json({ status: false, message: "All fields are required." });
    }

    // Validate inputs
    if (
      !validateName(firstName) ||
      !validateName(surName) ||
      !validateEmail(email) ||
      !validatePhone(phone)
    ) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid input values." });
    }

    // Check if the provided email or phone number already exists in the database (excluding the current creator)
    const existingEmail = await Creator.findOne({
      email,
      _id: { $ne: creatorId },
    });
    const existingPhone = await Creator.findOne({
      phone,
      _id: { $ne: creatorId },
    });

    if (existingEmail || existingPhone) {
      return res.status(400).json({
        status: false,
        message:
          "Email or phone number is already in use. Please provide another.",
      });
    }

    // Update the creator's information in the database
    const updatedCreator = await Creator.findByIdAndUpdate(
      creatorId,
      { firstName, surName, email, phone },
      { new: true } // Return the updated document
    );

    if (!updatedCreator) {
      return res
        .status(404)
        .json({ status: false, message: "Creator not found." });
    }

    res.status(200).json({
      status: true,
      message: "Creator updated successfully",
      data: updatedCreator,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const { creatorId } = req.body;

    const existingCreator = await Creator.findById(creatorId);
    if (!existingCreator) {
      return res
        .status(404)
        .json({ status: false, message: "Creator not found." });
    }

    if (!req.files["profile_pic"]) {
      return res
        .status(400)
        .json({ message: "Profile picture file is missing." });
    }

    // Get profile picture file location
    const profilePicFileLocation = req.files["profile_pic"][0].location;

    // Create a new Video instance with the profile picture and creatorId
    const createdPic = await ProfilePic.create({
      profile_pic: profilePicFileLocation,
      creatorId: creatorId,
    });

    res.status(201).json({
      status: true,
      message: "Profile picture uploaded successfully",
      data: createdPic,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.addBioAboutMe = async (req, res) => {
  try {
    const { creatorId, bio } = req.body;

    // Validate if creatorId is provided
    if (!creatorId) {
      return res
        .status(400)
        .json({ status: false, message: "Creator ID is required." });
    }

    // Validate if the provided creatorId exists in the database
    const existingCreator = await Creator.findById(creatorId);
    console.log(existingCreator, 262);
    if (!existingCreator) {
      return res
        .status(404)
        .json({ status: false, message: "Creator not found." });
    }

    // Update the bio information
    existingCreator.bio = bio;
    await existingCreator.save();

    res
      .status(200)
      .json({ status: true, message: "Bio information updated successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

exports.createSubscriber = async (req, res) => {
  try {
    const { firstName, lastName, subscribe, price, joiningDate, creatorId } =
      req.body;

    const existingCreator = await Creator.findById(creatorId);
    if (!existingCreator) {
      return res
        .status(404)
        .json({ status: false, message: "Creator not found." });
    }

    // Assuming you have a Subscriber model/schema
    const newSubscriber = new Subscriber({
      firstName,
      lastName,
      subscribe,
      price,
      joiningDate,
      creatorId,
    });

    // Save the new subscriber to the database
    const savedSubscriber = await newSubscriber.save();

    res.status(201).json(savedSubscriber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.fetchSubscriber = async (req, res) => {
  try {
    const { creatorId } = req.body;

    const existingCreator = await Creator.findById(creatorId);
    if (!existingCreator) {
      return res.status(404).json({ status: false, message: "Creator not found." });
    }

    // Fetch subscribers associated with the specified creatorId
    const subscribers = await Subscriber.find({ creatorId });

    res.status(200).json({ status: true, data: subscribers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.blockAndUnblockSubscriber = async (req, res) => {
  try {
    const { subscriberId, block } = req.body;

    // Find the subscriber by ID
    const subscriber = await Subscriber.findById(subscriberId);

    if (!subscriber) {
      return res.status(404).json({ status: false, message: 'Subscriber not found.' });
    }

    // Update the 'isBlocked' field based on the 'block' value
    subscriber.isBlocked = block;

    // Save the updated subscriber
    const updatedSubscriber = await subscriber.save();

    // Send a response with a customized message
    const actionMessage = block ? 'Subscriber blocked' : 'Subscriber unblocked';

    res.status(200).json({ status: true, message: actionMessage, data: updatedSubscriber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

