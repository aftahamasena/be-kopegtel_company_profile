// controllers/contactController.js
const { Contacts } = require("../models");

// 🟢 CREATE: Tambah kontak baru
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, subject, message) are required.",
      });
    }

    const newContact = await Contacts.create({ name, email, subject, message });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create contact." });
  }
};

// 🔵 READ: Ambil semua kontak
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contacts.findAll();
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch contacts." });
  }
};

// 🔴 DELETE: Hapus kontak berdasarkan ID
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contacts.findByPk(id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }

    await contact.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully." });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete contact." });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact,
};
