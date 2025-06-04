const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    chartId: { type: mongoose.Schema.Types.ObjectId, ref: "ChartConfig" },
    createdBy: String,
    insightText: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insight", insightSchema);
