const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");
const Subscriber = require("../models/subscriberModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Playlist = require("../models/playlistModel");
const Video = require("../models/videoModel");

const {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} = require("../utilis/validation");
const ProfilePic = require("../models/profileModel");
const MyCourse = require("../models/myCourseModel");
const PaymentSuccess = require("../models/paymentSuccessModel");
const paymentCreateDetails = require("../models/paymentCreateDetailsModel");
const TransactionHistory = require("../models/transactionHistoryModel");
const Wishlist = require("../models/wishlistModel");

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


exports.googleAuth = async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;

    // Split display name into first name and last name
    const [firstName, ...surNameArray] = displayName.split(" ");
    const surName = surNameArray.join(" ");

    // Check if the provided email already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id, role: "user" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        status: true,
        message: "User logged in successfully",
        token,
        data: existingUser,
      });
    }

    // User doesn't exist, create a new user
    const newUser = await User.create({
      firstName,
      surName,
      email,
      // Set default or placeholder values for phone and password
      phone: "",
      password: "",
      // Set profile picture value
      profile_pic: photoURL || "", // Use the provided URL or set a default value
    });

    const token = jwt.sign(
      { userId: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      data: newUser,
    });
  } catch (error) {
    console.error(error.message);
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
    const {
      userId,
      creatorId,
      course_id,
      description,
      thumbnail,
      title,
      video,
      price,
    } = req.body;

    const myCourse = await MyCourse.create({
      userId,
      creatorId,
      course_id,
      description,
      thumbnail,
      title,
      video,
      price,
    });

    const paymentSuccess = await PaymentSuccess.findOne({ userId });
    const { orderId, paymentDate } = paymentSuccess;

    const transactionHistory = new TransactionHistory({
      userId,
      courseId: course_id,
      couseName: title,
      video,
      price,
      transactionDate: paymentDate,
      orderId,
    });

    await transactionHistory.save();
    console.log(userId, "ujijdsi");

    await User.updateOne(
      { _id: userId },
      { $set: { isSubscriber: true, joinDate: Date.now() } }
    );

    return res.status(200).json({
      status: true,
      message: "My course created succcessfully.",
      data: myCourse,
    });
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
    return res.status(200).json({
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

exports.fetchVideos = async (req, res) => {
  try {
    const { id } = req.body;
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

exports.updateUser = async (req, res) => {
  try {
    const { firstName, surName, email, phone, userId } = req.body;

    // Build the update object based on provided fields
    const updateFields = {};
    if (firstName) {
      updateFields.firstName = firstName;
    }
    if (surName) {
      updateFields.surName = surName;
    }
    if (email) {
      updateFields.email = email;
    }
    if (phone) {
      updateFields.phone = phone;
    }

    // Perform the update operation using your database logic
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Send a success response with the updated user information
    res.json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.uploadUserProfilePic = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["profile_pic"]) {
      return res.status(400).json({ message: "Profile pic file is missing." });
    }

    const profilePicFileLocation = req.files["profile_pic"][0].location;

    // Assuming you have a User model with a field named 'profile_pic'
    const uploadedProfilePic = await User.findByIdAndUpdate(
      userId,
      { profile_pic: profilePicFileLocation },
      { new: true }
    );

    // Check if the user with the given userId exists
    if (!uploadedProfilePic) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Send a success response with the updated user information
    res.json({
      status: true,
      message: "Profile picture uploaded successfully",
      data: uploadedProfilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "User fetched successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.fetchTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.user;

    const transactionHistory = await TransactionHistory.find({ userId });

    // Check if the transaction history is empty
    if (transactionHistory.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No transaction history found" });
    }

    // Successfully fetched transaction history
    res.status(200).json({
      status: true,
      message: "Transaction history fetched successfully",
      data: transactionHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.createWishlist = async (req, res) => {
  try {
    // Extracting wishlist data from request body
    const {
      userId,
      playlist_title,
      playlist_description,
      price,
      playlist_thumbnail,
      preview_video,
      course_id,
    } = req.body;

    // Create a new wishlist item
    const newWishlistItem = new Wishlist({
      userId,
      playlist_title,
      playlist_description,
      price,
      playlist_thumbnail,
      preview_video,
      course_id,
    });

    // Save the wishlist item to the database
    await newWishlistItem.save();

    // Send success response
    res.status(201).json({
      status: true,
      message: "Wishlist item added successfully",
      data: newWishlistItem,
    });
  } catch (error) {
    console.error(error);

    // Send error response
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.fetchWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const wishlist = await Wishlist.find({ userId });

    // Check if the wishlsit is empty
    if (wishlist.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No wishlist found" });
    }

    // Successfully fetched transaction history
    res.status(200).json({
      status: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const { course_id, userId } = req.body;

    const wishlistItem = await Wishlist.findOne({ userId, course_id });
    if (!wishlistItem) {
      return res
        .status(404)
        .json({ status: false, message: "Wishlist item not found" });
    }

    await Wishlist.deleteOne({ userId, course_id });

    res.status(200).json({
      status: true,
      message: "Wishlist item discarded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
