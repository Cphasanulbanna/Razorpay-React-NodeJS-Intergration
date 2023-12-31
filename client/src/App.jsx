import React, { useState } from "react";
import logo from "../public/vite.svg";

import axios from "axios";

export const App = () => {
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const products = [
        {
            id: 1,
            image: "https://www.shop.panasonic.com/ca/sites/default/files/salsify/product/image/S5IIX_S-R2060_slant_K.jpg",
            price: 1000,
        },
        {
            id: 2,
            image: "https://maplestore.in/wp-content/uploads/2023/05/Apple-Care-Plus-for-MacBook-Pro-M2-13-inch-720x720.png",
            price: 5000,
        },
    ];

    const loadScript = async () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
    };

    const checkout = async (price) => {
        try {
            await loadScript();
            const {
                data: { key },
            } = await axios.get("http://localhost:8000/api/payment/");

            const response = await axios.post("http://localhost:8000/api/payment/checkout", {
                amount: price,
            });

            const { amount, currency, id } = response.data.order;

            const options = {
                key: key,
                amount: amount.toString(),
                currency: currency,
                name: "Banna",
                description: "Test Transaction",
                image: { logo },
                order_id: id,

                handler: async function (response) {
                    const data = {
                        orderCreationId: id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    };

                    try {
                        const result = await axios.post(
                            "http://localhost:8000/api/payment/verify-payment",
                            data
                        );
                        setIsPaymentSuccess(result.data.paymentStatus);
                    } catch (error) {
                        setIsPaymentSuccess(false);
                        console.log(error.message);
                    }
                },

                prefill: {
                    name: "Banna",
                    email: "banna@example.com",
                    contact: "9747159584",
                },
                notes: {
                    address: "Example Corporate Office",
                },
                theme: {
                    color: "#61dafb",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (response) {
                console.log(response.error.code);
                console.log(response.error.description);
                console.log(response.error.source);
                console.log(response.error.step);
                console.log(response.error.reason);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
            });

            paymentObject.open();

            console.log(response.data?.message);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <section id="home">
            <div className="content-box">
                {products?.map((product) => (
                    <div
                        key={product?.id}
                        className="product-container"
                    >
                        <div className="image">
                            <img
                                src={product.image}
                                alt="camera"
                            />
                        </div>
                        <p>{product?.price}</p>
                        <button
                            className="button"
                            onClick={() => checkout(product?.price)}
                        >
                            Buy now
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};
