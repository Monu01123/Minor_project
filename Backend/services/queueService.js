import Queue from 'better-queue';
import { uploadVideo } from './azureBlobService.js';
import fs from 'fs';
import logger from '../utils/logger.js';

// Initialize the Queue
// concurrent: 1 ensures videos are processed one at a time to save bandwidth/CPU
const videoQueue = new Queue(async (task, cb) => {
  const { filePath, originalName, tempId } = task;

  logger.info(`[Queue] Starting background processing for: ${originalName} (TempID: ${tempId})`);

  try {
    // 1. Simulate Transcoding/Processing Delay (e.g., 5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 2. Upload to Azure (The heavy lifting)
    const videoUrl = await uploadVideo(filePath);
    logger.info(`[Queue] Upload successful. URL: ${videoUrl}`);

    // 3. Cleanup local file
    fs.unlink(filePath, (err) => {
        if (err) logger.error('[Queue] Failed to delete local file:', err);
        else logger.info('[Queue] Local file cleaned up.');
    });

    // 4. Update Database
    // Replace the specific placeholder URL with the real one
    if (tempId) {
        // We look for the placeholder string that the frontend would have saved
        const placeholderUrl = `PROCESSING_VIDEO_TEMP_ID_${tempId}`;
        
        // Use promisePool (imported from ../db.js)
        // Ensure promisePool is imported at the top!
        try {
            const { promisePool } = await import('../db.js');
            const [result] = await promisePool.query(
                `UPDATE course_content SET content_url = ? WHERE content_url = ?`,
                [videoUrl, placeholderUrl]
            );
            logger.info(`[Queue] Database updated. Affected rows: ${result.affectedRows}`);
        } catch (dbError) {
             logger.error(`[Queue] Database update failed:`, dbError);
        }
    }
    
    cb(null, { videoUrl });
  } catch (error) {
    logger.error(`[Queue] Processing failed for ${originalName}:`, error);
    cb(error);
  }
}, { concurrent: 1 });

export default videoQueue;
