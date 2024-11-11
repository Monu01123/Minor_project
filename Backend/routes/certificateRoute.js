import express from "express";
import { promisePool } from "../db.js";

const router = express.Router();

router.post("/check-completion", async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const [rows] = await promisePool.query(
      `
      SELECT COUNT(*) = SUM(IFNULL(vt.is_watched, 0)) AS all_watched
      FROM course_content cc
      LEFT JOIN video_track vt ON cc.content_id = vt.content_id AND vt.user_id = ?
      WHERE cc.course_id = ?
      `,
      [userId, courseId]
    );

    res.json({ completed: rows[0].all_watched ? true : false });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
