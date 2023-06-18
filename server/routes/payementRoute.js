const express = require("express");
const { checkout, verifyPayment, getKey } = require("../controllers/payementController");
const router = express.Router();

router.post("/checkout/", checkout);
router.post("/verify-payment", verifyPayment);
router.get("/", getKey);

module.exports = router;
