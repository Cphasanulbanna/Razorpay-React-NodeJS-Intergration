const express = require("express");
const cors = require("cors");
require("dotenv").config();

const paymentRoute = require("./routes/payementRoute");
const { connectDb } = require("./config/db");

const PORT = 8000;

const app = express();

connectDb();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/payment/", paymentRoute);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
