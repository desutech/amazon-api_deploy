const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

app.post("/payment/create", async (req, res) => {
  try {
    const total = parseInt(req.query.total, 10); // Ensure `total` is a number
    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      res.status(201).json({
        clientSecret: paymentIntent.client_secret, // Correct property name
      });
    } else {
      res.status(403).json({
        message: "Total must be greater than 0",
      });
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(2000, (err) => {
  if (err) throw err;
  console.log("Amazon server running on port: 2000, http://localhost:2000/");
});
