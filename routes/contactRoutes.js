// routes/contactRoutes.js
const express = require("express");
const {
  createContact,
  getAllContacts,
  deleteContact,
} = require("../controllers/contactController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createContact);
router.get("/", authenticateToken, authorizeAdmin, getAllContacts);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteContact);

module.exports = router;
