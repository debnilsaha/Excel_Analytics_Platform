const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await User.create({ username, password: hashedPassword, role });
      res.status(201).json({ message: "User registered" });
    } catch (err) {
      console.error("Registration Error:", err);
  
      if (err.code === 11000) {
        // Duplicate key error (MongoDB)
        return res.status(409).json({ error: "Username already exists" });
      }
  
      res.status(500).json({ error: "Something went wrong" });
    }
  };

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, user: { username: user.username, role: user.role } });
};
