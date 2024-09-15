import { promisePool } from '../db.js'; // Using promise-based pool from mysql2

// Add a course to the wishlist
export const addToWishlist = async (req, res) => {
  const { user_id, course_id } = req.body;

  try {
    const [result] = await promisePool.query(
      `INSERT INTO wishlist (user_id, course_id) VALUES (?, ?)`,
      [user_id, course_id]
    );

    res.status(201).json({
      message: 'Course added to wishlist successfully',
      wishlist_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding course to wishlist' });
  }
};

// Get all courses in a user's wishlist
export const getWishlistByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT w.wishlist_id, w.course_id, c.title AS course_title, w.added_at
       FROM wishlist w
       JOIN courses c ON w.course_id = c.course_id
       WHERE w.user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No items found in wishlist for this user' });
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wishlist items' });
  }
};

// Remove a course from the wishlist
export const removeFromWishlist = async (req, res) => {
  const { wishlistId } = req.params;

  try {
    const [result] = await promisePool.query(`DELETE FROM wishlist WHERE wishlist_id = ?`, [wishlistId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json({ message: 'Course removed from wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing course from wishlist' });
  }
};

// Check if a course is in a user's wishlist
export const checkWishlistItem = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM wishlist WHERE user_id = ? AND course_id = ?`,
      [userId, courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Course is not in wishlist' });
    }

    res.json({ message: 'Course is in wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking wishlist item' });
  }
};
