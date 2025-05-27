const transporter = require("../Utils/emailTransport");
const { generateCandidateExamEmail } = require("../Utils/email template/emailTemplates_register");

const sendEmail = async (recipientEmail, password,examLink ) => {
  try {
    const emailContent = generateCandidateExamEmail(recipientEmail, password, examLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

module.exports = sendEmail;
