const ChartConfig = require("../models/ChartConfig");

exports.saveChartConfig = async (req, res) => {
  try {
    const { recordId, chartType, xAxis, yAxis, createdBy } = req.body;
    if (!recordId || !chartType || !xAxis || !yAxis || !createdBy) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const config = new ChartConfig({ recordId, chartType, xAxis, yAxis, createdBy });
    await config.save();
    res.status(201).json({ message: "Chart config saved" });
  } catch (err) {
    console.error("Save config error:", err);
    res.status(500).json({ error: "Failed to save chart config" });
  }
};
