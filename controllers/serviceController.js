const { Services } = require("../models");
const { uploadToCloudinary } = require("../utils/upload");
const { v2: cloudinary } = require("cloudinary");

// 🟢 CREATE: Tambah layanan baru dengan upload gambar
const createService = async (req, res) => {
  try {
    const { title, desc } = req.body;

    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, "services");

    const newService = await Services.create({
      title,
      desc,
      image: result.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create service. Please try again.",
    });
  }
};

// 🔵 READ: Ambil semua layanan
const getAllServices = async (req, res) => {
  try {
    const services = await Services.findAll();
    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services. Please try again.",
    });
  }
};

// 🟡 UPDATE: Update layanan berdasarkan ID (termasuk gambar)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;

    const service = await Services.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    let imageUrl = service.image; // Gunakan gambar lama jika tidak ada upload baru
    if (req.file) {
      // 🔹 Hapus gambar lama dari Cloudinary jika ada
      if (service.image) {
        const publicId = service.image.split("/").pop().split(".")[0]; // Ambil Public ID dari URL
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }

      // 🔹 Upload gambar baru
      const result = await uploadToCloudinary(req.file.buffer, "services");
      imageUrl = result.secure_url;
    }

    await service.update({
      title: title || service.title,
      desc: desc || service.desc,
      image: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update service. Please try again.",
    });
  }
};

// 🔴 DELETE: Hapus layanan berdasarkan ID
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // 🔹 Hapus gambar dari Cloudinary jika ada
    if (service.image) {
      const publicId = service.image.split("/").pop().split(".")[0]; // Ambil Public ID dari URL
      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    await service.destroy();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete service. Please try again.",
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
};
