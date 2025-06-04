const Record = require("../models/Record");
const ChartConfig = require("../models/chartConfig");
const Insight = require("../models/insight");

const getGlobalStats = async (req, res) => {
  try {
    const totalFiles = await Record.countDocuments();
    const totalCharts = await ChartConfig.countDocuments();
    const totalDownloads = await Record.aggregate([
      { $group: { _id: null, total: { $sum: "$downloads" } } },
    ]);

    const totalInsights = await Insight.countDocuments();

    res.status(200).json({
      totalFiles,
      totalCharts,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalInsights,
    });
  } catch (error) {
    console.error("Error getting global stats:", error);
    res.status(500).json({ error: "Failed to fetch analytics stats" });
  }
};

module.exports = { getGlobalStats };
