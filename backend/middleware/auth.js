const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../model/BlackList");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token, "auth");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if token is blacklisted
  const blacklistedToken = await BlackListModel.findOne({ token });
  if (blacklistedToken) {
    return res.status(440).json({ message: "Login again" });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token", error: err.message });
    }

    req.userId = decoded.userId; // attach userId to request
    next();
  });
};

module.exports = auth;
