import { promisePool } from '../db.js';

export const enrolledUserOnly = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const courseId = req.params.courseId || null; 
    if (!courseId) {
      console.log(`Fetching all courses for User ID: ${userId}`);
      return next();
    }

    console.log(`Checking enrollment for User ID: ${userId}, Course ID: ${courseId}`);
    const [rows] = await promisePool.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not enrolled in this course or not an admin.' });
    }

    next();
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
