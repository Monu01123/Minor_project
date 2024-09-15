import express from 'express';
import {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist,
  checkWishlistItem
} from '../Controllers/wishlistController.js';

const router = express.Router();

// Route to add a course to the wishlist
router.post('/wishlist', addToWishlist);

// Route to get all wishlist items for a specific user
router.get('/wishlist/user/:userId', getWishlistByUserId);

// Route to remove a course from the wishlist
router.delete('/wishlist/:wishlistId', removeFromWishlist);

// Route to check if a specific course is in the user's wishlist
router.get('/wishlist/check/:userId/:courseId', checkWishlistItem);

export default router;
