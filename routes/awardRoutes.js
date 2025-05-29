const express = require("express");
const {
  authenticateToken,
  authorizeAdmin,
  authorizeEditor,
} = require("../middlewares/authMiddleware");
const {
  createAward,
  getAllAwards,
  updateAward,
  deleteAward,
} = require("../controllers/awardController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  createAward
);
router.get("/", getAllAwards);
router.put(
  "/:id",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  updateAward
);
router.delete("/:id", authenticateToken, authorizeEditor, deleteAward);

module.exports = router;
