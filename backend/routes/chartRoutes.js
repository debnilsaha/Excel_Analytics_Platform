const express = require("express");
const router = express.Router();
const chartController = require("../controllers/chartController"); 

router.post("/save", chartController.saveChartConfig);

module.exports = router;
