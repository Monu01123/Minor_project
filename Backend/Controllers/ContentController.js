import { promisePool } from "../db.js";
import jwt from 'jsonwebtoken';


const logError = (action, error) => {
  console.error(`Error during ${action}: ${error.message}`);
  if (error.stack) console.error(error.stack);
};

export const addCourseContent = async (req, res) => {
  const {
    course_id,
    title,
    content_type,
    content_url,
    content_text,
    duration,
    content_order,
  } = req.body;

  try {
    const [result] = await promisePool.query(
      `INSERT INTO course_content (course_id, title, content_type, content_url, content_text, duration, content_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id,
        title,
        content_type,
        content_url,
        content_text,
        duration,
        content_order,
      ]
    );

    res.status(201).json({
      message: "Course content successfully added",
      content_id: result.insertId,
    });
  } catch (error) {
    logError("adding course content", error);
    res.status(500).json({
      message:
        "An error occurred while adding the course content. Please try again later or contact support if the issue persists.",
    });
  }
};

export const getCourseContentByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM course_content WHERE course_id = ? ORDER BY content_order`,
      [courseId]
    );

    res.status(200).json(rows.length > 0 ? rows : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching course content' });
  }
};


export const getCourseContentByCourseIdsecure = async (req, res) => {
    const { courseId } = req.params;
    const authHeader = req.headers.authorization;
    
    // Check if the token is present
    let userId = null;

    // Verify the token if it exists
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];  // Extract the token from the Authorization header

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using your secret
            userId = decoded.user_id;  // Extract the user ID from the token
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    }

    console.log('User ID:', userId, 'Course ID:', courseId);  // Debug log

    try {
        // Check if the user is enrolled in the course
        const [enrollment] = await promisePool.query(
            `SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?`,
            [userId, courseId]
        );

        // Fetch the course content
        const [courseContentRows] = await promisePool.query(
            `SELECT content_id, title, content_url FROM course_content WHERE course_id = ? ORDER BY content_order`,
            [courseId]
        );

        // Prepare the response based on enrollment status
        const responseContent = courseContentRows.map(content => ({
            content_id: content.content_id,
            title: content.title,
            content_url: enrollment.length > 0 ? content.content_url : null,  // Show URL only if enrolled
        }));

        return res.status(200).json(responseContent);
    } catch (error) {
        console.error("Error fetching course content: ", error);
        return res.status(500).json({ message: "Error fetching course content" });
    }
};



export const updateCourseContent = async (req, res) => {
  const { contentId } = req.params;
  const {
    title,
    content_type,
    content_url,
    content_text,
    duration,
    content_order,
  } = req.body;

  try {
    const [result] = await promisePool.query(
      `UPDATE course_content SET title = ?, content_type = ?, content_url = ?, content_text = ?, duration = ?, content_order = ?, updated_at = NOW() 
            WHERE content_id = ?`,
      [
        title,
        content_type,
        content_url,
        content_text,
        duration,
        content_order,
        contentId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          message:
            "Course content not found. Please ensure the content ID is correct.",
        });
    }

    res.json({ message: "Course content updated successfully." });
  } catch (error) {
    logError("updating course content", error);
    res.status(500).json({
      message:
        "An error occurred while updating the course content. Please try again later or contact support if the problem persists.",
    });
  }
};

export const deleteCourseContent = async (req, res) => {
  const { contentId } = req.params;

  try {
    const [result] = await promisePool.query(
      `DELETE FROM course_content WHERE content_id = ?`,
      [contentId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          message:
            "Course content not found. It may have already been deleted.",
        });
    }

    res.json({ message: "Course content deleted successfully." });
  } catch (error) {
    logError("deleting course content", error);
    res.status(500).json({
      message:
        "Failed to delete the course content. Please try again later or reach out to support for help.",
    });
  }
};
