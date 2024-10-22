import { promisePool } from '../db.js';

// Middleware to check if the user is enrolled in a specific course
export const enrolledUserOnly = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const courseId = req.params.courseId || null; // Get course ID from params if available

    if (!courseId) {
      // If no courseId, this middleware is likely called for fetching all enrollments for a user
      console.log(`Fetching all courses for User ID: ${userId}`);

      // You can skip to the next middleware here
      return next();
    }

    console.log(`Checking enrollment for User ID: ${userId}, Course ID: ${courseId}`);

    // SQL query to check if the user is enrolled in the course
    const [rows] = await promisePool.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    // If no enrollment is found and the user is not an admin, deny access
    if (rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not enrolled in this course or not an admin.' });
    }

    next(); // Move to the next middleware if everything is good
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
