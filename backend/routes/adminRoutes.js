const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  promoteUser,
  demoteUser,
} = require("../controllers/adminController");

// Admin Panel Endpoints
router.get("/users", getAllUsers);              // GET all users
router.delete("/users/:id", deleteUser);        // DELETE a user by ID
router.put("/users/:id/role", updateUserRole);  // PUT update user's role
router.patch("/promote/:id", promoteUser);
router.patch("/demote/:id", demoteUser);

module.exports = router; 
