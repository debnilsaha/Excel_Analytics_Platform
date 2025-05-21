const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  data: [mongoose.Schema.Types.Mixed], // flexible for Excel rows
  uploadedBy: String,
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  fileBuffer: Buffer, // ✅ added to support downloading
});

module.exports = mongoose.model("Record", recordSchema);
