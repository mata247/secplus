const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  try {
    // Create a Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      to,
      from: process.env.GMAIL_USER,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw "Failed to send email.";
  }
};

module.exports = { sendEmail };
