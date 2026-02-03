import express from "express";
import multer from "multer";
import {uploadImage} from "../services/azureBlobService2.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadImage(req.file.path); // Correct usage
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
