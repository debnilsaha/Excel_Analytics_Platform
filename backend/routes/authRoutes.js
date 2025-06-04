const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  getProfile,
  updatePassword,
  deleteAccount
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.patch("/update-password", authMiddleware, updatePassword);
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;
