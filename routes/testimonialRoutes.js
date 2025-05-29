// routes/testimonialRoutes.js
const express = require("express");
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { upload } = require("../utils/upload");
const {
  authenticateToken,
  authorizeEditor,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  upload.single("photo"),
  authenticateToken,
  authorizeEditor,
  createTestimonial
);
router.get("/", getAllTestimonials);
router.put(
  "/:id",
  upload.single("photo"),
  authenticateToken,
  authorizeEditor,
  updateTestimonial
);
router.delete("/:id", authenticateToken, authorizeEditor, deleteTestimonial);

module.exports = router;
