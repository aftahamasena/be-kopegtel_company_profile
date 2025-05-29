const { Awards } = require("../models");
const { uploadToCloudinary } = require("../utils/upload");
const { v2: cloudinary } = require("cloudinary");
const moment = require("moment-timezone");

const createAward = async (req, res) => {
  try {
    const { title, desc, date_received } = req.body;

    if (!title || !desc || !date_received) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, desc, date_received) are required.",
      });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "awards");
      imageUrl = result.secure_url;
    }

    const formattedDate = moment
      .tz(date_received, "Asia/Jakarta")
      .format("YYYY-MM-DD HH:mm:ss");

    const newAward = await Awards.create({
      title,
      desc,
      date_received: formattedDate,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Award created successfully",
      data: newAward,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create award." });
  }
};

const getAllAwards = async (req, res) => {
  try {
    const awards = await Awards.findAll();
    return res.status(200).json({ success: true, data: awards });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch awards." });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, date_received } = req.body;
    const award = await Awards.findByPk(id);

    if (!award) {
      return res
        .status(404)
        .json({ success: false, message: "Award not found." });
    }

    let imageUrl = award.image;
    if (req.file) {
      if (award.image) {
        const publicId = award.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`awards/${publicId}`);
      }
      const result = await uploadToCloudinary(req.file.buffer, "awards");
      imageUrl = result.secure_url;
    }

    const formattedDate = date_received
      ? moment.tz(date_received, "Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
      : award.date_received;

    await award.update({
      title: title || award.title,
      desc: desc || award.desc,
      date_received: formattedDate,
      image: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Award updated successfully",
      data: award,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update award." });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Awards.findByPk(id);

    if (!award) {
      return res
        .status(404)
        .json({ success: false, message: "Award not found." });
    }

    if (award.image) {
      const publicId = award.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`awards/${publicId}`);
    }

    await award.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Award deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete award." });
  }
};

module.exports = {
  createAward,
  getAllAwards,
  updateAward,
  deleteAward,
};
