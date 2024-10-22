import { promisePool } from '../db.js'; 


export const createReview = async (req, res) => {
  const { user_id, course_id, rating, comment } = req.body;

  try {
    // Check if the user has already submitted a review for this course
    const [existingReview] = await promisePool.query(
      `SELECT * FROM reviews WHERE user_id = ? AND course_id = ?`,
      [user_id, course_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({ message: 'You can only submit one review per course.' });
    }

    // Insert the new review into the reviews table
    const [result] = await promisePool.query(
      `INSERT INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [user_id, course_id, rating, comment]
    );

    // Calculate the new average rating for the course
    const [averageRatingResult] = await promisePool.query(
      `SELECT AVG(rating) AS average_rating FROM reviews WHERE course_id = ?`,
      [course_id]
    );

    console.log('Average Rating Result:', averageRatingResult);

    let newAverageRating = averageRatingResult[0]?.average_rating || 0;

    console.log('New Average Rating:', newAverageRating);

    // Update the course's average rating in the courses table
    const updateResult = await promisePool.query(
      `UPDATE courses SET average_rating = ? WHERE course_id = ?`,
      [newAverageRating, course_id]
    );

    console.log('Update Result:', updateResult);

    res.status(201).json({
      message: 'Review created and course rating updated successfully',
      review_id: result.insertId,
      newAverageRating: newAverageRating // Optionally, format the average rating
    });
  } catch (error) {
    console.error('Error during review creation:', error); // Enhanced logging
    res.status(500).json({ message: 'Error creating review and updating course rating' });
  }
};




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

    // if (rows.length === 0) {
    //   return res.status(404).json({ message: 'No reviews found for this course' });
    // }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

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


// Get existing review by course ID and user ID
export const getReviewByCourseAndUserId = async (req, res) => {
  const { courseId, userId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM reviews WHERE course_id = ? AND user_id = ?`,
      [courseId, userId]
    );

    res.json(rows); // This will return an array of reviews
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching review' });
  }
};


// Get reviews for a specific course owned by a specific instructor
export const getReviewsByCourseAndInstructor = async (req, res) => {
  const { courseId, instructorId } = req.params;

  try {
    // Ensure that the course belongs to the instructor before fetching the reviews
    const [reviews] = await promisePool.query(
      `SELECT r.review_id, r.user_id, r.course_id, r.rating, r.comment, r.created_at, c.title
       FROM reviews r
       JOIN courses c ON r.course_id = c.course_id
       WHERE r.course_id = ? AND c.instructor_id = ?`,
      [courseId, instructorId]
    );

    // if (reviews.length === 0) {
    //   return res.status(404).json({ message: 'No reviews found or unauthorized access' });
    // }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews for this course' });
  }
};
