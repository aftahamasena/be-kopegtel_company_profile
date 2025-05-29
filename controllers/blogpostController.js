const { Blog_posts } = require("../models");
const { uploadToCloudinary } = require("../utils/upload");
const { v2: cloudinary } = require("cloudinary");
const moment = require("moment-timezone");

const createBlogPost = async (req, res) => {
  try {
    console.log("📌 [DEBUG] Create Blog Post - Payload:", req.user);

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blog_posts");
      imageUrl = result.secure_url;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Set waktu publish otomatis UTC+7
    const published_at = moment()
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DD HH:mm:ss");

    const newBlog = await Blog_posts.create({
      title,
      slug,
      content,
      image: imageUrl,
      published_at,
    });

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("❌ [ERROR] Error creating blog post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog post.",
    });
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog_posts.findAll();
    return res.status(200).json({ success: true, data: blogPosts });
  } catch (error) {
    console.error("❌ [ERROR] Error fetching blog posts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts.",
    });
  }
};

const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog_posts.findOne({ where: { slug } });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("❌ [ERROR] Error fetching blog post by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog post.",
    });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const blog = await Blog_posts.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    let imageUrl = blog.image;
    if (req.file) {
      if (blog.image) {
        const publicId = blog.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blog_posts/${publicId}`);
      }
      const result = await uploadToCloudinary(req.file.buffer, "blog_posts");
      imageUrl = result.secure_url;
    }

    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : blog.slug;

    await blog.update({
      title: title || blog.title,
      slug,
      content: content || blog.content,
      image: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("❌ [ERROR] Error updating blog post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog post.",
    });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog_posts.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    if (blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blog_posts/${publicId}`);
    }

    await blog.destroy();

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    console.error("❌ [ERROR] Error deleting blog post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog post.",
    });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
};
