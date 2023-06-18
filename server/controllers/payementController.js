const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/paymentModel");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_APIKEY,
    key_secret: process.env.RAZORPAY_APIKEY_SECRET,
});

const checkout = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body?.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        res.status(200).json({ message: "success", order: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_APIKEY_SECRET)
            .update(razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (generatedSignature === razorpaySignature) {
            await Payment.create({
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
            });
            return res.status(200).json({ message: "payement successfull", paymentStatus: true });
        }
        return res.status(400).json({ message: "Payment failed", paymentStatus: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
};

const getKey = async (req, res) => {
    try {
        res.status(200).json({ key: process.env.RAZORPAY_APIKEY });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
};

module.exports = { checkout, verifyPayment, getKey };
