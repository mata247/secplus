const mongoose = require("mongoose");
const express = require("express");
const flash = require('express-flash');
const  register  = require("./controllers/register");
const verifyUser = require('./controllers/verifyUser')
const userDashboard = require("./controllers/userDashboard");
const auth = require("../../middleware/auth");
const forgotPassword = require("./controllers/forgotPassword");
const resetPassword = require("./controllers/resetPassword");
const login = require('./controllers/login');

const userRoutes = express.Router();

/// Configure and use express-flash for flash messages
userRoutes.use(flash());

userRoutes.get('/register', (req, res) => {
  res.render('register', {
    validationErrors: [], // Initialize an empty array for validation errors
    email: '',
    password: '',
    confirm_password: '',
    name: '',
    balance: '',
    mobileNumber: '',
    country: '',
    cityOrTownOrVillage: ''
    // Include other form field values as needed
  });
});
// Route to render the login form
userRoutes.get("/login", (req, res) => {
  res.render("login", { message: req.flash('error') }); // Pass flash messages to the view
});

// Registration route
userRoutes.post("/register", register);

// Verification route
userRoutes.get("/verify", verifyUser); // Handle GET request for verification link

// Define the POST route for user login
userRoutes.post('/login', login);

module.exports = userRoutes;
