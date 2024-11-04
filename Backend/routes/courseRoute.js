import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  getCoursesByInstructor,
} from "../Controllers/courseController.js";
import { authenticateToken } from "../middleware/authenticateToken.js"; 
import { instructorOnly } from "../middleware/InstructorMiddleware.js"; 
import { adminOnly } from "../middleware/adminMiddleware.js"; 

const router = express.Router();

// Only authenticated instructors or admins can create a course
router.post("/courses", authenticateToken, instructorOnly, createCourse);

// Any authenticated user can view all courses
router.get("/courses", getCourses);

// Any authenticated user can view a course by its ID
router.get("/courses/:courseId", getCourseById);

// Only authenticated instructors or admins can update a course
router.put(
  "/courses/:courseId",
  authenticateToken,
  instructorOnly,
  updateCourse
);

// Only authenticated instructors or admins can delete a course
router.delete(
  "/courses/:courseId",
  authenticateToken,
  instructorOnly,
  deleteCourse
);

// Any authenticated user can get courses by category
router.get("/courses/category/:categoryId", getCoursesByCategory);

// Any authenticated user can get courses by instructor
router.get(
  "/courses/instructor/:instructorId",
  authenticateToken,
  instructorOnly,
  getCoursesByInstructor
);
export default router;
