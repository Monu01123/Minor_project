// import express from 'express';
// import multer from 'multer';
// import {uploadVideo}  from '../services/azureBlobService.js';

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// router.post('/', upload.single('video'), async (req, res) => {
//   try {
//     const videoUrl = await uploadVideo(req.file.path);
//     res.status(200).json({ videoUrl }); 
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to upload video' });
//   }
// });

// export default router;

import express from 'express';
import multer from 'multer';
import fs from 'fs'; // To delete local files
import { uploadVideo } from '../services/azureBlobService.js';

const router = express.Router();

// Configure multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Name the file
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only video files
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

    // Delete the local file after uploading
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
