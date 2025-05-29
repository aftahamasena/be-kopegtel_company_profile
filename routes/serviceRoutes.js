const express = require("express");
const {
  authenticateToken,
  authorizeAdmin,
  authorizeEditor,
} = require("../middlewares/authMiddleware");
const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  createService
);
router.get("/", getAllServices);
router.put(
  "/:id",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  updateService
);
router.delete("/:id", authenticateToken, authorizeEditor, deleteService);

module.exports = router;
