const express = require("express");
const {
  authenticateToken,
  authorizeEditor,
} = require("../middlewares/authMiddleware");
const {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blogpostController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  createBlogPost
);

router.get("/", getAllBlogPosts);
router.get("/:slug", getBlogPostBySlug);

router.put(
  "/:id",
  upload.single("image"),
  authenticateToken,
  authorizeEditor,
  updateBlogPost
);

router.delete("/:id", authenticateToken, authorizeEditor, deleteBlogPost);

module.exports = router;
