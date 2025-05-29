const { Projects } = require("../models");
const { uploadToCloudinary } = require("../utils/upload");
const { v2: cloudinary } = require("cloudinary");

// Fungsi untuk mengonversi tanggal ke format DD/MM/YYYY
const formatDateToDDMMYYYY = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Fungsi untuk mengonversi tanggal dari DD/MM/YYYY ke YYYY-MM-DD
const parseDateFromDDMMYYYY = (date) => {
  if (!date) return null;
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}`);
};

// 🟢 CREATE: Tambah proyek baru dengan upload gambar
const createProject = async (req, res) => {
  try {
    const { title, desc, client, date } = req.body;

    if (!title || !desc || !client || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, desc, client, date) are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, "projects");
    const formattedDate = parseDateFromDDMMYYYY(date);

    const newProject = await Projects.create({
      title,
      desc,
      client,
      date: formattedDate,
      image: result.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        ...newProject.toJSON(),
        date: formatDateToDDMMYYYY(newProject.date),
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create project." });
  }
};

// 🔵 READ: Ambil semua proyek
const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.findAll();
    const formattedProjects = projects.map((project) => ({
      ...project.toJSON(),
      date: formatDateToDDMMYYYY(project.date),
    }));
    return res.status(200).json({ success: true, data: formattedProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch projects." });
  }
};

// 🟡 UPDATE: Update proyek berdasarkan ID (termasuk gambar)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, client, date } = req.body;
    const project = await Projects.findByPk(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    let imageUrl = project.image;
    if (req.file) {
      if (project.image) {
        const publicId = project.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`projects/${publicId}`);
      }
      const result = await uploadToCloudinary(req.file.buffer, "projects");
      imageUrl = result.secure_url;
    }

    const formattedDate = date ? parseDateFromDDMMYYYY(date) : project.date;

    await project.update({
      title: title || project.title,
      desc: desc || project.desc,
      client: client || project.client,
      date: formattedDate,
      image: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { ...project.toJSON(), date: formatDateToDDMMYYYY(project.date) },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update project." });
  }
};

// 🔴 DELETE: Hapus proyek berdasarkan ID
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Projects.findByPk(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    if (project.image) {
      const publicId = project.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`projects/${publicId}`);
    }

    await project.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete project." });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
};
