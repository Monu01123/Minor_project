import express from 'express';
import multer from 'multer';
import fs from 'fs'; 
import { uploadVideo } from '../services/azureBlobService.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
  },
});

router.post('/', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded.' });
  }

  try {
    const videoUrl = await uploadVideo(req.file.path);

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete local file:', err);
    });

    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

export default router;
