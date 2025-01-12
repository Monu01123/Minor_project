import express from "express";
import {
  addCourseContent,
  getCourseContentByCourseId,
  updateCourseContent,
  deleteCourseContent,
  getCourseContentByCourseIdsecure,
} from "../Controllers/ContentController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { instructorOnly } from "../middleware/instructorMiddleware.js"; // Middleware for instructors
// import { adminOnly } from '../middleware/adminMiddleware.js';           // Middleware for admins

const router = express.Router();

router.post("/content", authenticateToken, instructorOnly, addCourseContent);

router.get(
  "/content/:courseId",
  // authenticateToken,
  getCourseContentByCourseId
);

router.get(
  "/content/enrolled/:courseId",
  // authenticateToken,
  getCourseContentByCourseIdsecure
);

router.put(
  "/content/:contentId",
  authenticateToken,
  instructorOnly,
  updateCourseContent
);

router.delete(
  "/content/:contentId",
  authenticateToken,
  instructorOnly,
  deleteCourseContent
);

export default router;
