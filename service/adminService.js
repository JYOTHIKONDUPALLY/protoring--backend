
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const { generateToken } = require("../Utils/tokenUtils");

const registerAdminService = async (name, email, password, role) => {
  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new admin
  const newAdmin = new Admin({
    name,
    email,
    password: hashedPassword,
    role: role || "admin", // Default role is "admin"
  });

  await newAdmin.save();
  return newAdmin;
};

const loginAdminService = async (email, password) => {
  // Check if admin exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Generate JWT token
  const token = generateToken({ id: admin._id, role: admin.role });

  return { token, admin };
};

module.exports = { registerAdminService, loginAdminService };
