const mongoose = require("mongoose");

const chartConfigSchema = new mongoose.Schema({
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record", required: true },
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChartConfig", chartConfigSchema);
