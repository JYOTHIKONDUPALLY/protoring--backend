const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET || "supersecretkey"; // Use environment variable for security
  const expiresIn = payload.role=="admin"?"1d":"2h"; // Token expiry time
  return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = { generateToken };