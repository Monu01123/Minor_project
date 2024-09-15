import { promisePool } from '../db.js'; // Using promise-based pool from mysql2

// Enroll a user in a course
export const enrollUserInCourse = async (req, res) => {
  const { user_id, course_id } = req.body;

  try {
    const [existingEnrollment] = await promisePool.query(
      `SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?`,
      [user_id, course_id]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    const [result] = await promisePool.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`,
      [user_id, course_id]
    );

    res.status(201).json({
      message: 'User enrolled successfully',
      enrollment_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enrolling user' });
  }
};

// Get all enrollments for a user
export const getEnrollmentsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT e.enrollment_id, e.enrolled_at, e.progress, c.title 
       FROM enrollments e
       JOIN courses c ON e.course_id = c.course_id
       WHERE e.user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No enrollments found for this user' });
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
};

// Update enrollment progress
export const updateEnrollmentProgress = async (req, res) => {
  const { enrollmentId } = req.params;
  const { progress } = req.body;

  try {
    const [result] = await promisePool.query(
      `UPDATE enrollments SET progress = ?, enrolled_at = NOW() WHERE enrollment_id = ?`,
      [progress, enrollmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating progress' });
  }
};

// Delete an enrollment (unenroll)
export const deleteEnrollment = async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const [result] = await promisePool.query(`DELETE FROM enrollments WHERE enrollment_id = ?`, [enrollmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'User unenrolled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting enrollment' });
  }
};
