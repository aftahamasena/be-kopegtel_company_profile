const express = require("express");
const {
  authenticateToken,
  authorizeEditor,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Hanya bisa diakses oleh Editor dan Admin
router.get(
  "/editor-feature",
  authenticateToken,
  authorizeEditor,
  (req, res) => {
    res.json({ success: true, message: "Welcome Editor!" });
  }
);

// 🔹 Hanya bisa diakses oleh Admin
router.get("/admin-feature", authenticateToken, authorizeAdmin, (req, res) => {
  res.json({ success: true, message: "Welcome Admin!" });
});

module.exports = router;
