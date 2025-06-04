const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  filename: String,
  data: Array,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 }
},  { timestamps: true });

module.exports = mongoose.models.Record || mongoose.model("Record", recordSchema);
