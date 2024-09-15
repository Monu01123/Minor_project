import { promisePool } from '../db.js'; // Using promise-based pool from mysql2

// Add new course content
export const addCourseContent = async (req, res) => {
  const { course_id, title, content_type, content_url, content_text, duration, content_order } = req.body;

  try {
    const [result] = await promisePool.query(
      `INSERT INTO course_content (course_id, title, content_type, content_url, content_text, duration, content_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [course_id, title, content_type, content_url, content_text, duration, content_order]
    );

    res.status(201).json({
      message: 'Course content added successfully',
      content_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding course content' });
  }
};

// Get course content by course ID
export const getCourseContentByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM course_content WHERE course_id = ? ORDER BY content_order`,
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No content found for this course' });
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching course content' });
  }
};

// Update course content by content ID
export const updateCourseContent = async (req, res) => {
  const { contentId } = req.params;
  const { title, content_type, content_url, content_text, duration, content_order } = req.body;

  try {
    const [result] = await promisePool.query(
      `UPDATE course_content SET title = ?, content_type = ?, content_url = ?, content_text = ?, duration = ?, content_order = ?, updated_at = NOW() 
       WHERE content_id = ?`,
      [title, content_type, content_url, content_text, duration, content_order, contentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Course content updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating course content' });
  }
};

// Delete course content by content ID
export const deleteCourseContent = async (req, res) => {
  const { contentId } = req.params;

  try {
    const [result] = await promisePool.query(`DELETE FROM course_content WHERE content_id = ?`, [contentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Course content deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting course content' });
  }
};
