const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await usersModel.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      req.flash("message", "This email does not exist in the system!");
      return res.redirect("/errors"); // Redirect to the login page with the error message
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      req.flash("message", "Email and password do not match!");
      return res.redirect("/errors"); // Redirect to the login page with the error message
    }

    // Check if the user is verified (add this condition if email verification is required)
    if (!user.isVerified) {
      req.flash("message", "Please verify your email before logging in!");
      return res.redirect("/errors"); // Redirect to the login page with the error message
    }

    // Generate an access token using jwtManager
    const accessToken = jwtManager(user);

    // Store the access token in the session
    req.session.accessToken = accessToken;

    // Redirect to the welcome page after successful login
    return res.redirect("/welcome");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("message", "An error occurred during login. Please try again later.");
    return res.redirect("/register"); // Redirect to the login page with an error message
  }
};

module.exports = login;
