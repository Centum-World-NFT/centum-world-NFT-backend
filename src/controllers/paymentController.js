const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.createPayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const { amount, order_id, payment_capture, currency } = req.body;

    console.log(req.body,13);
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: order_id,
      payment_capture: payment_capture,
    };
    const order = await instance.orders.create(options);
    if (!order)
      return res.status(500).json({ status: false, message: "Payment failed" });

    res.status(200).json({ status: true, data: order });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto.Hmac("sha256",process.env.RAZORPAY_SECRET_KEY).update(sign.toString()).digest("hex");
      console.log(razorpay_signature , expectedSignature)
    if(expectedSignature ===  razorpay_signature){
        console.log("Payment successful")
        return res.status(200).json({message: "Payment successfull!"})
    }else{
        return res.status(400).json({message:"Invalid signature sent"});
    }
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
  }
};
