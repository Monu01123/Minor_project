import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../Controllers/courseController.js';

const router = express.Router();

// Route to create a new course
router.post('/courses', createCourse);

// Route to get all courses
router.get('/courses', getCourses);

// Route to get a specific course by ID
router.get('/courses/:courseId', getCourseById);

// Route to update a course by ID
router.put('/courses/:courseId', updateCourse);

// Route to delete a course by ID
router.delete('/courses/:courseId', deleteCourse);

export default router;
