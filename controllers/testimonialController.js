// controllers/testimonialController.js
const { Testimonials } = require("../models");
const { uploadToCloudinary } = require("../utils/upload");
const { v2: cloudinary } = require("cloudinary");

// 🟢 CREATE: Tambah testimonial baru dengan upload gambar
const createTestimonial = async (req, res) => {
  try {
    const { client_name, position, message, rating } = req.body;

    if (!client_name || !position || !message || rating === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (client_name, position, message, rating) are required.",
      });
    }

    // 🛑 Validasi rating harus antara 1-10
    if (rating < 1 || rating > 10) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 10.",
      });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "testimonials");
      imageUrl = result.secure_url;
    }

    const newTestimonial = await Testimonials.create({
      client_name,
      position,
      message,
      rating,
      photo: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial.",
    });
  }
};

// 🔵 READ: Ambil semua testimonial
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonials.findAll();
    return res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch testimonials." });
  }
};

// 🟡 UPDATE: Update testimonial berdasarkan ID (termasuk gambar)
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name, position, message, rating } = req.body;
    const testimonial = await Testimonials.findByPk(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    // 🛑 Validasi rating harus antara 1-10 jika diberikan
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 10.",
      });
    }

    let imageUrl = testimonial.photo;
    if (req.file) {
      if (testimonial.photo) {
        const publicId = testimonial.photo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`testimonials/${publicId}`);
      }
      const result = await uploadToCloudinary(req.file.buffer, "testimonials");
      imageUrl = result.secure_url;
    }

    await testimonial.update({
      client_name: client_name || testimonial.client_name,
      position: position || testimonial.position,
      message: message || testimonial.message,
      rating: rating !== undefined ? rating : testimonial.rating,
      photo: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial.",
    });
  }
};

// 🔴 DELETE: Hapus testimonial berdasarkan ID
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonials.findByPk(id);

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found." });
    }

    if (testimonial.photo) {
      const publicId = testimonial.photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`testimonials/${publicId}`);
    }

    await testimonial.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Testimonial deleted successfully." });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete testimonial." });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
