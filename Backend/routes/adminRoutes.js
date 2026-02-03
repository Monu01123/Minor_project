import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

export default router;
