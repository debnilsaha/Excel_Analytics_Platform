// backend/routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { getGlobalStats } = require("../controllers/analyticsController");

router.get("/stats", getGlobalStats);

module.exports = router;
