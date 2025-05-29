// routes/projectRoutes.js
const express = require("express");
const {
  authenticateToken,
  authorizeAdmin,
  authorizeEditor,
} = require("../middlewares/authMiddleware");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  createProject
);
router.get("/", getAllProjects);
router.put(
  "/:id",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  updateProject
);
router.delete("/:id", authenticateToken, authorizeEditor, deleteProject);

module.exports = router;
