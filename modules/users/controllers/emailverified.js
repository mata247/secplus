// account-activated.js

const express = require("express");

const userRoutes = express.Router();

// ... Other routes ...

// Email verification success route
userRoutes.get("/account-activated", (req, res) => {
  const { token } = req.query;

  // You can add logic to verify the token here if needed
  // For simplicity, we'll assume it's already verified

  res.render("account-activated"); // Render the email confirmation success page
});

// ... Other routes ...

module.exports = userRoutes;
