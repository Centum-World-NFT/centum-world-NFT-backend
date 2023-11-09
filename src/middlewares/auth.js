const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({status:false, message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({status:false, message: "Token missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({status:false, message: "Invalid token" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({status:false, message: "Internal server error" });
  }
};

exports.authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({status:false, message: "Unauthorized: User role not found" });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Unauthorized: only ${allowedRoles.join(", ")} can access`,
      });
    }
    next();
  };
};
