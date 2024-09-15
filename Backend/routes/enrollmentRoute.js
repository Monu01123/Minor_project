import express from 'express';
import {
  enrollUserInCourse,
  getEnrollmentsByUserId,
  updateEnrollmentProgress,
  deleteEnrollment
} from '../Controllers/enrollmentController.js';

const router = express.Router();

// Route to enroll a user in a course
router.post('/enrollments', enrollUserInCourse);

// Route to get all enrollments for a specific user
router.get('/enrollments/user/:userId', getEnrollmentsByUserId);

// Route to update enrollment progress
router.put('/enrollments/:enrollmentId', updateEnrollmentProgress);

// Route to delete an enrollment (unenroll)
router.delete('/enrollments/:enrollmentId', deleteEnrollment);

export default router;
