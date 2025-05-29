const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { Users } = require("../models");

// 🔹 Skema validasi dengan Joi
const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "editor").required(),
});
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6).optional(), // ✅ Password opsional saat update
  role: Joi.string().valid("admin", "editor"),
});

// 📌 CREATE - Tambah User
const createUser = async (req, res) => {
  try {
    // ✅ Validasi input
    const { error, value } = userSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    // 🔒 Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // 🚀 Simpan user ke database
    const newUser = await Users.create({ ...value, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 READ - Ambil Semua User
const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "username", "email", "role", "createdAt"],
      order: [
        [Sequelize.literal("role = 'admin' DESC")], // Admin didahulukan
        ["username", "ASC"], // Username diurutkan secara alfabetis
      ],
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 READ - Ambil User Berdasarkan ID
const getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "role", "createdAt"],
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 UPDATE - Perbarui User
const updateUser = async (req, res) => {
  try {
    // Validasi request body
    const { error, value } = updateUserSchema.validate(req.body, {
      allowUnknown: false, // Hanya field yang diperbolehkan yang boleh masuk
      stripUnknown: true, // Field tidak dikenal akan dibuang otomatis
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Cari user berdasarkan ID
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash password jika ada dan tidak kosong
    if (value.password && value.password.trim() !== "") {
      value.password = await bcrypt.hash(value.password, 10);
    } else {
      delete value.password; // Hapus jika kosong agar tidak mengubah password lama
    }

    // Hindari perubahan ID
    delete value.id;

    // Update user
    await user.update(value);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 📌 DELETE - Hapus User
const deleteUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await user.destroy();
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 🟢 Export Controller
module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
