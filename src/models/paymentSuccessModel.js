const mongoose = require("mongoose");

const paymentSuccessSchema = new mongoose.Schema({
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

paymentDate: {
    type: Date,
    default:Date.now
},
});

const paymentSuccess = mongoose.model(
"PaymentSuccess",
paymentSuccessSchema
);
module.exports = paymentSuccess;
