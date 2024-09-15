import express from 'express';
import {
  createReview,
  getReviewsByCourseId,
  updateReview,
  deleteReview
} from '../Controllers/reviewController.js';

const router = express.Router();

// Route to create a new review
router.post('/reviews', createReview);

// Route to get all reviews for a specific course
router.get('/reviews/course/:courseId', getReviewsByCourseId);

// Route to update a review
router.put('/reviews/:reviewId', updateReview);

// Route to delete a review
router.delete('/reviews/:reviewId', deleteReview);

export default router;
