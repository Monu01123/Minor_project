import {promisePool} from '../db.js'; 

export const reviewOwnerOrAdminOnly = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId; 
    const userId = req.user.id; 


    const [rows] = await promisePool.execute(
      'SELECT user_id FROM reviews WHERE id = ?',
      [reviewId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    const reviewOwnerId = rows[0].user_id; 

  
    if (userId !== reviewOwnerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not the owner of this review or an admin.' });
    }

    next(); 
  } catch (error) {
    console.error('Error verifying review ownership:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
