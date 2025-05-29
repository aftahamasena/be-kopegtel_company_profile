const { V3 } = require("paseto");
require("dotenv").config();

const secretKey = Buffer.from(process.env.PASETO_SECRET_KEY, "base64");

const authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No Token Provided" });
    }

    const payload = await V3.decrypt(token, secretKey);
    req.user = payload;
    req.authAdmin = payload.role === "admin";
    req.authEditor = payload.role === "editor" || req.authAdmin;

    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};

const authorizeEditor = (req, res, next) => {
  if (req.authEditor) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access Denied: Only Editors and Admins Can Access This Feature" });
};

const authorizeAdmin = (req, res, next) => {
  if (req.authAdmin) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access Denied: Only Admins Can Access This Feature" });
};

module.exports = { authenticateToken, authorizeEditor, authorizeAdmin };
