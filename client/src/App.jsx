import React from "react";

const App = () => {
    const BASE_URL = "http://localhost:6000/api/";

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const showRazorpay = async () => {
        const response = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!response) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await axios.post(`${BASE_URL}orders`);

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        // Getting the order details back
        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: process.env.KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Hasanul banna.",
            description: "Test Transaction",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post(`${BASE_URL}success`, data);

                alert(result.data.msg);
            },
            prefill: {
                name: "Hasanul Banna",
                email: "banna@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Hasanul Banna Corporate Office",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };
    return (
        <section>
            <div></div>
            <div>
                <button onClick={() => showRazorpay()}>Pay 500</button>
            </div>
        </section>
    );
};

export default App;
