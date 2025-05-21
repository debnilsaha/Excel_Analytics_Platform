const User = require("../models/User");

// Get all users (for admin panel listing)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Admin Get Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin Delete User Error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    res.json({ message: "User role updated", user: updatedUser });
  } catch (err) {
    console.error("Admin Update Role Error:", err);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

// Promote user to admin
exports.promoteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndUpdate(id, { role: "admin" });
      res.json({ message: "User promoted to admin." });
    } catch (err) {
      res.status(500).json({ error: "Failed to promote user." });
    }
  };
  
  // Demote admin to user
  exports.demoteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndUpdate(id, { role: "user" });
      res.json({ message: "Admin demoted to user." });
    } catch (err) {
      res.status(500).json({ error: "Failed to demote admin." });
    }
  };
  