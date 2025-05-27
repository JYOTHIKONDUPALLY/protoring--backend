const generateCandidateExamEmail = (email, password, examLink) => {
    return {
      subject: "Your Exam Login Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #C93A3A;">Exam Login Details</h2>
          <p>Dear Candidate,</p>
          <p>You have been registered for the upcoming exam. Please find your login credentials below:</p>
          
          <table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Password:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #C93A3A;"><strong>${password}</strong></td>
            </tr>
          </table>
          
          <p>Click the link below to access the exam:</p>
          <p><a href="${examLink}" style="display: inline-block; padding: 10px 15px; background-color: #C93A3A; color: white; text-decoration: none; border-radius: 5px;">Start Exam</a></p>
  
          <p><strong>Note:</strong> This password is confidential. Do not share it with anyone.</p>
          
          <p>Best of luck!</p>
          <p>Regards,</p>
          <p><strong>Your Examination Team</strong></p>
        </div>
      `,
    };
  };
  
  module.exports = { generateCandidateExamEmail };
  