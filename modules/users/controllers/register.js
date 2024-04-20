const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const generateUniqueToken = require("../../../managers/generateUniqueToken");
const emailManager = require("../../../managers/emailManager");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const usersModel = mongoose.model("users");

    const { email, password, confirm_password, name, balance, mobileNumber, country, cityOrTownOrVillage } = req.body;

    const validationErrors = [];

    if (!email) {
      validationErrors.push("L'e-mail doit être fourni!");
    }
    if (!password) {
      validationErrors.push("Le mot de passe doit être indiqué!");
    }
    if (password.length < 5) {
      validationErrors.push("Le mot de passe doit comporter au moins 5 caractères");
    }
    if (!name) {
      validationErrors.push("Le nom est exigé");
    }
    if (password !== confirm_password) {
      validationErrors.push("Le mot de passe et le mot de passe confirmé ne correspondent pas!");
    }

    const getDuplicateEmail = await usersModel.findOne({
      email: email,
    });

    if (getDuplicateEmail) {
      validationErrors.push("Cet e-mail existe déjà !");
    }

    if (validationErrors.length > 0) {
      return res.render('register', {
        validationErrors,
        email,
        password, // Include other form field values as needed
        confirm_password,
        name,
        balance,
        mobileNumber,
        country,
        cityOrTownOrVillage,
      });
    }

    // Generate a verification token
    const verificationToken = generateUniqueToken();

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await usersModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      balance: balance,
      mobileNumber: mobileNumber,
      country: country,
      cityOrTownOrVillage: cityOrTownOrVillage,
      verificationToken: verificationToken, // Store the verification token
      isVerified: false, // Initialize user as not verified
    });

    // Determine the base URL based on the environment
    const baseUrl = (process.env.NODE_ENV === 'production'
      ? process.env.PROD_VERIFICATION_URL
      : process.env.DEV_VERIFICATION_URL).trimEnd('/');

    // Construct the email message for verification using the determined base URL
    const emailSubject = "Email Verification";
    const verificationLink = `${baseUrl}?token=${verificationToken}`;
    const emailText = `Click the following link to verify your email: ${verificationLink}`;
    const emailHtml = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;

    // Send the verification email using the emailManager
    await emailManager.sendEmail(
      createdUser.email,
      emailSubject,
      emailText,
      emailHtml
    );

    // Respond with JSON
    res.render('registrationSuccess', {
      successMessage: "L'utilisateur s'est inscrit avec succès ! Veuillez vérifier votre e-mail pour les instructions de vérification."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = register;
