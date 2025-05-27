const express = require("express");
const sendEmail = require("../service/sendEmail");
const {verifyRole}=require("../middleware/authMiddleware");
const router = express.Router();

router.post("/send-email", verifyRole(["admin"]),async (req, res) => {
  const { email, password,examLink } = req.body;

  if (!email || !password || !examLink) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    await sendEmail(email, password, examLink);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;
