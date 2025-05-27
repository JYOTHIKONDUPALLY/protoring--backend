const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Use an App Password if using Gmail
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter configuration error:", error);
  } else {
    console.log("Email transporter is ready to send messages.");
  }
});

module.exports = transporter;
