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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_APIKEY_SECRET);
        generatedSignature.update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");

        if (generatedSignature === razorpay_signature) {
            await Payment.create({
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
            });
            return res.status(200).json({ message: "payement successfull" });
        }
        return res.status(400).json({ message: "Payment failed" });
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
