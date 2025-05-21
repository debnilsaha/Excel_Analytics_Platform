const xlsx = require("xlsx");
const Record = require("../models/Record");

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const record = new Record({
      data: sheetData,
      uploadedBy: req.body.username || "unknown",
      filename: req.file.originalname,
      fileBuffer: req.file.buffer,
    });

    await record.save();
    res.status(201).json({ message: "File uploaded and data saved" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.getAllRecords = async (req, res) => {
  const role = req.query.role;
  const username = req.query.username;

  try {
    const records =
      role === "admin"
        ? await Record.find().sort({ uploadedAt: -1 })
        : await Record.find({ uploadedBy: username }).sort({ uploadedAt: -1 });

    res.json(records);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};
