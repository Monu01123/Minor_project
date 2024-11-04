import express from "express";
import { promisePool } from "../db.js";
const router = express.Router();

router.post("/video/track", async (req, res) => {
  console.log("Received request to mark video as watched:", req.body); // Log incoming request

  const { userId, courseId, contentId } = req.body;
  console.log(
    "userId:",
    userId,
    "courseId:",
    courseId,
    "contentId:",
    contentId
  );

  if (!userId || !courseId || !contentId) {
    return res
      .status(400)
      .json({ message: "User ID, Course ID, and Content ID are required" });
  }

  try {
    // Verify contentId exists in course_content table
    const [content] = await promisePool.query(
      "SELECT content_id FROM course_content WHERE content_id = ?",
      [contentId]
    );

    if (content.length === 0) {
      return res.status(404).json({ message: "Invalid content ID" });
    }

    // Insert or update watch status
    await promisePool.query(
      `
            INSERT INTO video_track (user_id, course_id, content_id, is_watched)
            VALUES (?, ?, ?, TRUE) 
            ON DUPLICATE KEY UPDATE is_watched = TRUE
        `,
      [userId, courseId, contentId]
    );

    res
      .status(200)
      .json({ message: "Video watch status updated successfully" });
  } catch (error) {
    console.error("Error updating video watch status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/video/track/:userId/:courseId", async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const [results] = await promisePool.query(
      `
            SELECT content_id, is_watched 
            FROM video_track 
            WHERE user_id = ? AND course_id = ?
        `,
      [userId, courseId]
    );

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching video watch status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
