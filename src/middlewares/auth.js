const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: false, message: "Token missing" });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
      req.user = decodedToken;

      console.log(req.user,"26")
      next();
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: "Invalid token: " + error.message,
      });
    }
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

exports.authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized: User role not found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: false,
        message: `Unauthorized: only ${allowedRoles.join(", ")} can access`,
      });
    }

    next();
  };
};
