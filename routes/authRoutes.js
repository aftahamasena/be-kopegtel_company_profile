const express = require("express");
const { authenticate, logout } = require("../controllers/authenticate");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/auth", authenticate);
router.post("/logout", logout);
router.get("/auth/me", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role, // Role user (admin/editor)
    },
  });
});

module.exports = router;
