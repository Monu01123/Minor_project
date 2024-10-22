import {promisePool} from '../db.js'; // Adjust the import based on your project structure

export const reviewOwnerOrAdminOnly = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId; // Get the review ID from the request parameters
    const userId = req.user.id; // Get the user ID from the authenticated user (assumes authenticateToken sets req.user)

    // Query to get the review's owner
    const [rows] = await promisePool.execute(
      'SELECT user_id FROM reviews WHERE id = ?',
      [reviewId]
    );

    // If no review is found, return a 404 error
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    const reviewOwnerId = rows[0].user_id; // Get the owner's user_id from the query result

    // Check if the current user is the owner of the review or an admin
    if (userId !== reviewOwnerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not the owner of this review or an admin.' });
    }

    next(); // If authorized, move to the next middleware or controller
  } catch (error) {
    console.error('Error verifying review ownership:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
