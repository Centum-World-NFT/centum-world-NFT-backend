const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");
const bcrypt = require("bcrypt");

const {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} = require("../utilis/validation");

exports.signupCreator = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    email;
    if (!fullName) {
      return res
        .status(422)
        .json({ status: false, message: "Full Name is required." });
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
    if (!validateName(fullName)) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Full Name." });
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
          message: "This email is already in use. Please provide another email address.",
        });
      }
  
      // Check if the provided phone number already exists in the database
      const existingPhone = await Creator.findOne({ phone: phone });
      if (existingPhone) {
        return res.status(400).json({
          status: false,
          message: "This phone number is already in use. Please provide another phone number.",
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
    // Perform validation on the email and password
    // if (!validateEmail(email) || !validatePassword(password)) {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: "Invalid email or password format." });
    // }

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
