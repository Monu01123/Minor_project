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

import videoQueue from '../services/queueService.js';

router.post('/', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded.' });
  }

  // Generate a tempId that will be matched in the DB
  const tempId = Date.now();
  
  // Offload to Queue
  videoQueue.push({
    filePath: req.file.path,
    originalName: req.file.originalname,
    tempId: tempId 
  });

  // Immediate Response
  res.status(202).json({ 
    message: 'Video upload started in background. It will exist shortly.',
    status: 'processing',
    tempId: tempId
  });
});

export default router;
