import express from "express";
const router = express.Router();
import {
  addQuiz,
  modifyQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
} from "../Controllers/quizController.js";

// Add a quiz to a specific video content
router.post("/quiz", addQuiz);

// Modify an existing quiz
router.put("/quiz/:quizId", modifyQuiz);

// Delete a quiz
router.delete("/quiz/:quizId", deleteQuiz);

// Get a quiz and its answers
router.get("/quiz/:quizId", getQuiz);

router.get("/quiz/course/:courseId", getQuizzesByCourse);

export default router;
