    const mongoose = require("mongoose");

    const paymentCreateDetailsSchema = new mongoose.Schema({
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

    const paymentCreateDetails = mongoose.model(
    "PaymentCreateDetails",
    paymentCreateDetailsSchema
    );
    module.exports = paymentCreateDetails;
