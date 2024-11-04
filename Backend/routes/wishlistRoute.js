import express from "express";
import {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist,
  checkWishlistItem,
  getWishlistCount,
} from "../Controllers/wishlistController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// Add item to wishlist
router.post("/wishlist", authenticateToken, addToWishlist);

// Get wishlist for a user
router.get("/wishlist/user/:userId", authenticateToken, getWishlistByUserId);

// Remove item from wishlist
router.delete(
  "/wishlist/user/:wishlistId",
  authenticateToken,
  removeFromWishlist
);

// Check if a course is in the user's wishlist
router.get(
  "/wishlist/check/:userId/:courseId",
  authenticateToken,
  checkWishlistItem
);

router.get("/wishlist/count/:userId", getWishlistCount);

export default router;
