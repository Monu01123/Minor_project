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
import { instructorOnly } from "../middleware/instructorMiddleware.js"; 
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { adminOnly } from "../middleware/adminMiddleware.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management API
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Course created successfully
 *       500:
 *         description: Server error
 */
router.post(
  "/courses",
  authenticateToken,
  instructorOnly,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category_id").isInt().withMessage("Category ID must be an integer"),
  ],
  validate,
  createCourse
);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Returns the list of all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: The list of the courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   course_id:
 *                      type: integer
 *                   title:
 *                      type: string
 *                   description:
 *                      type: string
 */
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
