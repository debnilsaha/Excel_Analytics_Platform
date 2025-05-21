const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const Record = require("../models/Record");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload Excel file
router.post("/upload", upload.single("file"), uploadController.uploadExcel);

// ✅ Get all uploaded records
router.get("/records", uploadController.getAllRecords);

// ✅ Delete a specific record by ID
router.delete("/records/:id", async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ✅ Download the original file by ID
router.get("/records/:id/download", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record || !record.fileBuffer) {
      return res.status(404).send("File not found");
    }

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${record.filename}"`,
    });

    res.send(record.fileBuffer);
  } catch {
    res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;
