import express from "express";
import {
  updateCategory,
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from "../Controllers/categoryController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { validateCategory } from "../middleware/validateCategory.js";
import { instructorOnly } from "../middleware/instructorMiddleware.js";
// import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  // instructorOnly,
  validateCategory,
  createCategory
);

router.put(
  "/:id",
  authenticateToken,
  // instructorOnly,
  validateCategory,
  updateCategory
);

router.delete("/:id", authenticateToken, deleteCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
export default router;
