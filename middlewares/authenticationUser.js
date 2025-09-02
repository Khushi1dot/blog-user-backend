const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authentication = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("Please login");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId=decoded.userId;
    // Store email in request for later use
    // Get the full user or selected fields from DB
    const user = await User.findById(decoded.userId).select("username profilePic email");
    if (!user) return res.status(404).send("User not found");
 // Store user object on request


  req.user = user;

    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("REQ.USERID:", req.userId);
    console.log("REQ.USER:", req.user);

    next();
  } catch (err) {
    console.log("Auth error:", err);
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports = authentication;
