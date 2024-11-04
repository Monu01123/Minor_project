import express from 'express';
import {
  createReview,
  getReviewsByCourseId,
  updateReview,
  deleteReview,
  getReviewByCourseAndUserId,
  getReviewsByCourseAndInstructor
} from '../Controllers/reviewController.js';
import { authenticateToken } from '../middleware/authenticateToken.js'; 
// import { reviewOwnerOrAdminOnly } from '../middleware/reviewOwnerOrAdmin.js'; 

const router = express.Router();

// Only authenticated users can create reviews
router.post('/reviews',authenticateToken,  createReview);

// Anyone can view reviews for a course
router.get('/reviews/course/:courseId', getReviewsByCourseId);

// Only the review owner or an admin can update the review
router.put('/reviews/:reviewId',authenticateToken,  updateReview);

// Only the review owner or an admin can delete the review
router.delete('/reviews/:reviewId', authenticateToken, deleteReview);

router.get('/reviews/course/:courseId/user/:userId', authenticateToken, getReviewByCourseAndUserId);

router.get('/reviews/course/:courseId/instructor/:instructorId', authenticateToken, getReviewsByCourseAndInstructor);



export default router;
