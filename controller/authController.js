const { loginService, logoutService, registerService } = require("../service/authService");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { token, user } = await loginService(email, password);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);

        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Your one-time password has expired.") {
            return res.status(401).json({ message: error.message });
        }

        if (error.message === "User already logged in") {
            return res.status(403).json({ message: error.message });
        }

        if (error.message === "Invalid password") {
            return res.status(401).json({ message: error.message });
        }

        // Generic server error for unexpected issues
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const logout = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await logoutService(email);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const {candidates, role, assignmentId } = req.body;

        const { createdUsers, existingUsers } = await registerService(candidates, role, assignmentId);

        res.status(201).json({
            message: "Users registered successfully",
            createdUsers,
            existingUsers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, logout, register };
