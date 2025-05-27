const jwt=require("jsonwebtoken");

const verifyRole = (allowedRoles) => (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denined. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
        const userId=decoded.id
        req.userId = userId;

        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access denied. You don't have permission to access" });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token." });
    }
}

    module.exports={verifyRole};
