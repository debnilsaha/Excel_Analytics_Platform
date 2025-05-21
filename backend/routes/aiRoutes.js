const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/insight", aiController.generateInsight);

module.exports = router;
