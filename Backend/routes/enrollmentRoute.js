import express from 'express';
import {
  enrollUserInCourse,
  getEnrollmentsByUserId,
  updateEnrollmentProgress,
  deleteEnrollment,
  getEnrollmentCountByCourseId
} from '../Controllers/enrollmentController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';  // To verify user token
import { adminOnly } from '../middleware/adminMiddleware.js';            // For admin-specific actions (if needed)
import { enrolledUserOnly } from '../middleware/enrolledUserMiddleware.js'; // To restrict certain actions to the enrolled user

const router = express.Router();

// Only authenticated users can enroll in a course
router.post('/enrollments',authenticateToken, enrollUserInCourse);

// Only authenticated users can view their enrollments
router.get('/enrollments/user/:userId',authenticateToken,enrolledUserOnly, getEnrollmentsByUserId);

// Only authenticated users (or admin) can view enrollment count for a course
router.get('/courses/:courseId/enrollment-count', getEnrollmentCountByCourseId);

// Only authenticated users can update their enrollment progress
router.put('/enrollments/:enrollmentId',  updateEnrollmentProgress);

// Only authenticated users (or admin) can delete their enrollment
router.delete('/enrollments/:enrollmentId', deleteEnrollment);

export default router;
