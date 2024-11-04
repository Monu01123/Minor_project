import express from "express";
import {
  addToCart,
  getCartByUserId,
  removeFromCart,
  clearCart,
  getCartCount
} from "../Controllers/cartController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/cart",authenticateToken, addToCart);
router.get("/cart/user/:userId",authenticateToken, getCartByUserId);
router.delete("/cart/item/:cartItemId",authenticateToken, removeFromCart);
router.delete("/cart/user/:userId",authenticateToken, clearCart);
router.get('/cart/count/:userId', getCartCount);
export default router;
