import { promisePool } from '../db.js'; 

export const addToWishlist = async (req, res) => {
  const { user_id, course_id } = req.body;

  try {
      const [existingWishlistItem] = await promisePool.query(
          `SELECT * FROM wishlist WHERE user_id = ? AND course_id = ?`,
          [user_id, course_id]
      );

      if (existingWishlistItem.length > 0) {
          return res.status(200).json({ message: 'Course is already in the wishlist' });
      }

      const [result] = await promisePool.query(
          `INSERT INTO wishlist (user_id, course_id) VALUES (?, ?)`,
          [user_id, course_id]
      );

      res.status(201).json({
          message: 'Course added to wishlist successfully',
          wishlist_id: result.insertId
      });
  } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ message: 'Error adding course to wishlist' });
  }
};


export const getWishlistByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [wishlistItems] = await promisePool.query(
      `SELECT 
        w.wishlist_id, 
        w.course_id, 
        c.title AS course_title, 
        c.price, 
        c.discount_price, 
        w.added_at,
        c.image_url 
      FROM wishlist w
      JOIN courses c ON w.course_id = c.course_id
      WHERE w.user_id = ?`,
      [userId]
    );

    // if (wishlistItems.length === 0) {
    //   return res.status(404).json({ message: 'No items found in wishlist for this user' });
    // }

    res.json(wishlistItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wishlist items' });
  }
};



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

export const getWishlistCount = async (req, res) => {
  const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const [result] = await promisePool.query(
            'SELECT COUNT(course_id) AS wishlist_count FROM wishlist WHERE user_id = ?',
            [userId]
        );
        res.json({ wishlist_count: result[0].wishlist_count });
    } catch (error) {
        console.error('Error fetching wishlist count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};