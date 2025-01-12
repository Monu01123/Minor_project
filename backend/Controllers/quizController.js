import { promisePool } from "../db.js";

export const addQuiz = async (req, res) => {
  const { courseId, title, question, answers } = req.body;
  try {
    const [quizResult] = await promisePool.query(
      `INSERT INTO quizzes (course_id, title, question) VALUES (?, ?, ?)`,
      [courseId, title, question]
    );
    const quizId = quizResult.insertId;

    for (let answer of answers) {
      await promisePool.query(
        `INSERT INTO quiz_answers (quiz_id, answer_text, is_correct) VALUES (?, ?, ?)`,
        [quizId, answer.text, answer.isCorrect]
      );
    }

    res.json({ message: "Quiz added successfully" });
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ message: "Error adding quiz" });
  }
};

export const modifyQuiz = async (req, res) => {
  const { quizId, title, question, answers } = req.body;

  try {
    await promisePool.query(
      `UPDATE quizzes SET title = ?, question = ?, updated_at = CURRENT_TIMESTAMP WHERE quiz_id = ?`,
      [title, question, quizId]
    );

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

export const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    await promisePool.query(`DELETE FROM quiz_answers WHERE quiz_id = ?`, [quizId]);
    await promisePool.query(`DELETE FROM quizzes WHERE quiz_id = ?`, [quizId]);

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Error deleting quiz" });
  }
};

export const getQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const [quizRows] = await promisePool.query(
      `SELECT * FROM quizzes WHERE quiz_id = ?`,
      [quizId]
    );
    if (quizRows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

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

export const getQuizzesByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT q.quiz_id, q.title, q.question, 
              qa.answer_id, qa.answer_text, qa.is_correct
       FROM quizzes q
       LEFT JOIN quiz_answers qa ON q.quiz_id = qa.quiz_id
       WHERE q.course_id = ?`,
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this course" });
    }

    const quizzesMap = new Map();
    for (let row of rows) {
      if (!quizzesMap.has(row.quiz_id)) {
        quizzesMap.set(row.quiz_id, {
          quiz_id: row.quiz_id,
          title: row.title,
          question: row.question,
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
    res.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};
