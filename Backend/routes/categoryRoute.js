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
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  adminOnly,
  validateCategory,
  createCategory
);
router.put(
  "/:id",
  authenticateToken,
  adminOnly,
  validateCategory,
  updateCategory
);
router.delete("/:id", authenticateToken, adminOnly, deleteCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
export default router;
