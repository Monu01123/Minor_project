import express from 'express';
import {
  addCourseContent,
  getCourseContentByCourseId,
  updateCourseContent,
  deleteCourseContent
} from '../Controllers/contentController.js';

const router = express.Router();

// Route to add new course content
router.post('/content', addCourseContent);

// Route to get all content of a course by course ID
router.get('/content/:courseId', getCourseContentByCourseId);

// Route to update course content by content ID
router.put('/content/:contentId', updateCourseContent);

// Route to delete course content by content ID
router.delete('/content/:contentId', deleteCourseContent);

export default router;
