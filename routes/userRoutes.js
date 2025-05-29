const express = require("express");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// 🔹 Hanya admin yang bisa mengelola user
router.post("/", authenticateToken, authorizeAdmin, createUser);
router.get("/", authenticateToken, authorizeAdmin, getUsers);
router.get("/:id", authenticateToken, authorizeAdmin, getUserById);
router.put("/:id", authenticateToken, authorizeAdmin, updateUser);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;
