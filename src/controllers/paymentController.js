const Razorpay = require("razorpay");
const crypto = require("crypto");
const PaymentCreateDetails = require("../models/paymentCreateDetailsModel");
const PaymentSuccess = require("../models/paymentSuccessModel");

function generateRandomId(length) {
  const nums = "0123456789";
  let randomNumber = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * nums.length);
    randomNumber += nums.charAt(randomIndex);
  }

  return randomNumber;
}

exports.createPayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    let { amount, order_id, payment_capture, currency } = req.body;
    const userId = req.user.userId;
    console.log(userId, "userid =====");

    order_id = generateRandomId(5) + "CENTUM" + generateRandomId(5);
    console.log(order_id);

    console.log(req.body, 13);
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: order_id,
      payment_capture: payment_capture,
    };
    const order = await instance.orders.create(options);
    if (!order)
      return res.status(500).json({ status: false, message: "Payment failed" });

    const paymentDetails = new PaymentCreateDetails({
      userId: userId,
      price: amount,
      orderId: order_id,
    });

    paymentDetails.save();

    res.status(200).json({ status: true, data: order, paymentDetails });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
  exports.verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const userId = req.user.userId; 
      console.log(userId, "userid")

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY) // Corrected this line
        .update(sign.toString())
        .digest("hex");

      console.log(razorpay_signature, expectedSignature);
      if (expectedSignature === razorpay_signature) {
        console.log("Payment successful");

        const paymentCreateDetails = await PaymentCreateDetails.findOne({userId});
        const { price, orderId, paymentDate } = paymentCreateDetails;

        const paymentSuccess = new PaymentSuccess({
          userId,
          price,
          orderId,
          paymentDate,
        });

        paymentSuccess.save();

        await PaymentCreateDetails.findOneAndDelete({userId});

        return res.status(200).json({ message: "Payment successful!" });
      } else {
        return res.status(400).json({ message: "Invalid signature sent" });
      }
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: "Internal server error" });
    }
  };
