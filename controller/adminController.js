const { registerAdminService, loginAdminService } = require("../service/adminService");
const User=require("../Models/User");
const Assignment=require("../Models/assignments");
const Exam=require("../Models/exam");
const Result=require("../Models/results");
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Call the service function for registering an admin
    const newAdmin = await registerAdminService(name, email, password, role);
    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the service function for logging in an admin
    const { token, admin } = await loginAdminService(email, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const [
      userCount,
      candidatesAttempted,
      assignmentsCount,
      candidatesList,
      examCount,
      passFailCountByRole,
    ] = await Promise.all([
      // 1. Get total number of users
      User.countDocuments(),

      // 2. Get count of candidates who attempted the exam (i.e., their loginTimestamps is not null)
      User.countDocuments({ role: "user", loginTimestamps: { $ne: null } }),

      // 3. Get total number of assignments
      Assignment.countDocuments(),

      // 4. Get list of candidates who attempted the exam (fetch required fields)
      User.find(
        { role: "user", loginTimestamps: { $ne: null } },
        { _id: 1, name: 1, email: 1, loginTimestamps: 1 }
      ),

      // 5. Get total number of exams created
      Exam.countDocuments(),

      // 6. Get pass/fail count based on user roles
      User.aggregate([
        { $lookup: {
          from: "results",
          localField: "_id",
          foreignField: "userId",
          as: "results"
        }},
        { $unwind: "$results" },
        { $group: {
          _id: { role: "$role", resultStatus: "$results.status" },
          count: { $sum: 1 }
        }},
        { $group: {
          _id: "$_id.role",
          passCount: { $sum: { $cond: [{ $eq: ["$_id.resultStatus", "Passed"] }, "$count", 0] } },
          failCount: { $sum: { $cond: [{ $eq: ["$_id.resultStatus", "Failed"] }, "$count", 0] } }
        }},
      ]),
    ]);

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      userCount,
      candidatesAttempted,
      assignmentsCount,
      candidatesList, // List of users who attempted an exam
      examCount, // Total exams created
      passFailCountByRole, // Count of pass/fail based on roles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





module.exports = { registerAdmin, loginAdmin,getDashboardData };
