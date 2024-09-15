import { promisePool } from '../db.js'; // Using promise-based pool from mysql2

// Create a new review
export const createReview = async (req, res) => {
  const { user_id, course_id, rating, comment } = req.body;

  try {
    // Insert a new review
    const [result] = await promisePool.query(
      `INSERT INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [user_id, course_id, rating, comment]
    );

    res.status(201).json({
      message: 'Review created successfully',
      review_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating review' });
  }
};

// Get all reviews for a course
export const getReviewsByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT r.review_id, r.user_id, r.rating, r.comment, r.created_at, u.full_name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.course_id = ?`,
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this course' });
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const [result] = await promisePool.query(
      `UPDATE reviews SET rating = ?, comment = ?, created_at = NOW() WHERE review_id = ?`,
      [rating, comment, reviewId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const [result] = await promisePool.query(`DELETE FROM reviews WHERE review_id = ?`, [reviewId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting review' });
  }
};
