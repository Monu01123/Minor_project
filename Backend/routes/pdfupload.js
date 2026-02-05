import express from "express";
import multer from "multer";
import { uploadPdf } from "../services/azureBlobService3.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for multer

// PDF Upload Route
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file provided" });
    }

    const pdfUrl = await uploadPdf(req.file.path);
    res.status(200).json({ pdfUrl });
  } catch (error) {
    console.error("PDF upload failed:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
});

export default router;
