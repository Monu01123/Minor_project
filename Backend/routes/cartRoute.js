import express from 'express';
import {
    addToCart,
    getCartByUserId,
    removeFromCart,
    clearCart
} from '../Controllers/cartController.js';

const router = express.Router();

router.post('/cart', addToCart);
router.get('/cart/user/:userId', getCartByUserId);
router.delete('/cart/item/:cartItemId', removeFromCart);
router.delete('/cart/user/:userId', clearCart);
export default router;
