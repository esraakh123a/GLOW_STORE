const Contact = require("../models/contact");

// ===============================
// Send Contact Message
// ===============================
const sendMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // Check required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Create message
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

// ===============================
// Get All Messages - Admin
// ===============================
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting messages",
      error: error.message,
    });
  }
};

// ===============================
// Get Message By ID - Admin
// ===============================
const getMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting message",
      error: error.message,
    });
  }
};

// ===============================
// Mark Message As Read - Admin
// ===============================
const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    message.status = "read";

    await message.save();

    res.status(200).json({
      message: "Message marked as read",
      contact: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating message",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  getMessageById,
  markAsRead,
};