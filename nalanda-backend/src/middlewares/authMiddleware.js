const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Token format: Bearer <token>
        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Invalid token user" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
