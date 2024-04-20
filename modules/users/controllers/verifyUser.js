const mongoose = require("mongoose");
const connectMongo = require('connect-mongodb-session');

const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const generateUniqueToken = require("../../../managers/generateUniqueToken");
const emailManager = require("../../../managers/emailManager");
const crypto = require("crypto");



// Verification route for verifying the user by clicking the link
const verifyUser = async (req, res) => {
  try {
    const usersModel = mongoose.model("users");
    const { token } = req.query;

    // Find the user by verification token
    const user = await usersModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "User not found or token has expired." });
    }

    // Log the user's current isVerified status before the update
    console.log("Current isVerified status:", user.isVerified);

    // Set the user's isVerified property to true
    user.isVerified = true;

    // Log the user's isVerified status after the update
    console.log("New isVerified status:", user.isVerified);

    await user.save();

    // Redirect to the account-activated page with a success message
    return res.render('verify', {user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = verifyUser;
