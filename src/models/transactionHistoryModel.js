const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  couseName: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: String,
  },
});

const transactionHistory = mongoose.model(
  "TransactionHistory",
  transactionHistorySchema
);
module.exports = transactionHistory;
