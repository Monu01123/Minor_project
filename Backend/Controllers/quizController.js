import { promisePool } from "../db.js";

// Add a new quiz to a specific video content
export const addQuiz = async (req, res) => {
    const { contentId, title, question, answers, timestamp } = req.body;
    try {
      const [quizResult] = await promisePool.query(
        `INSERT INTO quizzes (content_id, title, question) VALUES (?, ?, ?)`,
        [contentId, title, question]
      );
      const quizId = quizResult.insertId;
  
      for (let answer of answers) {
        await promisePool.query(
          `INSERT INTO quiz_answers (quiz_id, answer_text, is_correct) VALUES (?, ?, ?)`,
          [quizId, answer.text, answer.isCorrect]
        );
      }
  
      // Link quiz to timestamp
      await promisePool.query(
        `INSERT INTO quiz_timestamps (quiz_id, timestamp) VALUES (?, ?)`,
        [quizId, timestamp]
      );
  
      res.json({ message: "Quiz added successfully" });
    } catch (error) {
      console.error("Error adding quiz:", error);
      res.status(500).json({ message: "Error adding quiz" });
    }
  };
  
  // Modify an existing quiz
  export const modifyQuiz = async (req, res) => {
    const { quizId, title, question, answers } = req.body;
  
    try {
      // Update quiz details
      await promisePool.query(
        `UPDATE quizzes SET title = ?, question = ?, updated_at = CURRENT_TIMESTAMP WHERE quiz_id = ?`,
        [title, question, quizId]
      );
  
      // Delete existing answers and insert updated ones
      await promisePool.query(`DELETE FROM quiz_answers WHERE quiz_id = ?`, [quizId]);
      for (let answer of answers) {
        await promisePool.query(
          `INSERT INTO quiz_answers (quiz_id, answer_text, is_correct) VALUES (?, ?, ?)`,
          [quizId, answer.text, answer.isCorrect]
        );
      }
  
      res.json({ message: "Quiz updated successfully" });
    } catch (error) {
      console.error("Error modifying quiz:", error);
      res.status(500).json({ message: "Error modifying quiz" });
    }
  };
  
  // Delete a quiz
  export const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
  
    try {
      // Delete quiz answers and quiz-timestamp links
      await promisePool.query(`DELETE FROM quiz_answers WHERE quiz_id = ?`, [quizId]);
      await promisePool.query(`DELETE FROM quiz_timestamps WHERE quiz_id = ?`, [quizId]);
  
      // Delete quiz itself
      await promisePool.query(`DELETE FROM quizzes WHERE quiz_id = ?`, [quizId]);
  
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Error deleting quiz" });
    }
  };
  
  // Get quiz and its answers
  export const getQuiz = async (req, res) => {
    const { quizId } = req.params;
  
    try {
      // Fetch quiz details
      const [quizRows] = await promisePool.query(
        `SELECT * FROM quizzes WHERE quiz_id = ?`,
        [quizId]
      );
      if (quizRows.length === 0) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      // Fetch quiz answers
      const [answerRows] = await promisePool.query(
        `SELECT * FROM quiz_answers WHERE quiz_id = ?`,
        [quizId]
      );
  
      res.json({
        quiz: quizRows[0],
        answers: answerRows
      });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Error fetching quiz" });
    }
  };
  
export const getQuizzesByContent = async (req, res) => {
  const { contentId } = req.params;

  try {
    // console.log("Fetching quizzes for contentId:", contentId);

    const [rows] = await promisePool.query(
      `SELECT q.quiz_id, q.title, q.question, qt.timestamp, 
              qa.answer_id, qa.answer_text, qa.is_correct
       FROM quizzes q
       JOIN quiz_timestamps qt ON q.quiz_id = qt.quiz_id
       LEFT JOIN quiz_answers qa ON q.quiz_id = qa.quiz_id
       WHERE q.content_id = ?`,
      [contentId]
    );

    // console.log("content id is "+ contentId);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this content" });
    }

    // Group answers by quiz_id
    const quizzesMap = new Map();
    for (let row of rows) {
      if (!quizzesMap.has(row.quiz_id)) {
        quizzesMap.set(row.quiz_id, {
          quiz_id: row.quiz_id,
          title: row.title,
          question: row.question,
          timestamp: row.timestamp,
          answers: []
        });
      }
      if (row.answer_id) {
        quizzesMap.get(row.quiz_id).answers.push({
          answer_id: row.answer_id,
          answer_text: row.answer_text,
          is_correct: row.is_correct
        });
      }
    }

    const quizzes = Array.from(quizzesMap.values());
    // console.log("Final quizzes structure:", quizzes);
    res.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};

  