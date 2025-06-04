const User = require("../models/User");
const Record = require("../models/Record");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const usersWithFiles = await Promise.all(
      users.map(async (user) => {
        const files = await Record.find({ uploadedBy: user.username }).select("filename uploadedAt -_id");
        return {
          ...user.toObject(),
          files,
        };
      })
    );
    res.json(usersWithFiles);
  } catch (err) {
    console.error("Admin Get Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

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

exports.promoteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndUpdate(id, { role: "admin" });
      res.json({ message: "User promoted to admin." });
    } catch (err) {
      res.status(500).json({ error: "Failed to promote user." });
    }
  };
  
  exports.demoteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndUpdate(id, { role: "user" });
      res.json({ message: "Admin demoted to user." });
    } catch (err) {
      res.status(500).json({ error: "Failed to demote admin." });
    }
  };
  