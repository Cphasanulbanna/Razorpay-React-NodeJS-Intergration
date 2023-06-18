const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Razorpay = require("razorpay");

const PORT = 6000;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/orders/", async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });

    const options = {
        amount: 50000, // amount in smallest currency unit
        currency: "INR",
        receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.status(200).json({ message: "success", order: order });
    try {
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
