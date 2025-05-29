const bcrypt = require("bcrypt");
const { V3 } = require("paseto");
const userModel = require("../models/index").Users;
require("dotenv").config();

const secretKey = Buffer.from(process.env.PASETO_SECRET_KEY, "base64");

const authenticate = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password harus diisi.",
    });
  }

  try {
    let dataUser = await userModel.findOne({
      where: { username },
      attributes: ["id", "username", "email", "password", "role"],
    });

    if (!dataUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, dataUser.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = await V3.encrypt(
      {
        id: dataUser.id,
        username: dataUser.username,
        email: dataUser.email,
        role: dataUser.role,
      },
      secretKey
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });
    return res.status(200).json({
      success: true,
      message: "Authentication Success",
      user: {
        id: dataUser.id,
        username: dataUser.username,
        email: dataUser.email,
        role: dataUser.role,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Success",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { authenticate, logout };
