import React, { useState, useEffect } from "react";
import Navbar from "../Home/NavBar.js";
import axiosInstance from "../../axiosconfig.js";
import { useParams } from "react-router-dom";

const QuizForm = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  // console.log("this is course id",courseId);

  const fetchQuizzes = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/quiz/course/${courseId}` // Fetch quizzes according to courseId
      );
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error.response || error);
      setError("Failed to fetch quizzes. Please try again.");
    }
  };

  useEffect(() => {
    if (!courseId) {
      console.error("courseId is missing!");
      return;
    }
    fetchQuizzes(); // Fetch quizzes using courseId
  }, [courseId]);

  const handleEdit = (quiz) => {
    setQuizId(quiz.quiz_id);
    setTitle(quiz.title);
    setQuestion(quiz.question);

    if (quiz.answers && Array.isArray(quiz.answers)) {
      setAnswers(quiz.answers.map((answer) => answer.answer_text));
    } else {
      setAnswers(["", "", "", ""]);
    }

    const correctIndex = quiz.answers.findIndex(
      (answer) => answer.is_correct === 1
    );
    setCorrectAnswer(correctIndex !== -1 ? correctIndex : null);
  };

  const resetForm = () => {
    setQuizId(null);
    setTitle("");
    setQuestion("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer(null);
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      courseId,
      quizId,
      title,
      question,
      answers: answers.map((text, idx) => ({
        text,
        isCorrect: idx === correctAnswer,
      })),
    };

    try {
      if (quizId) {
        const response = await axiosInstance.put(
          `/api/quiz/${quizId}`,
          quizData
        );
        if (response.status >= 200 && response.status < 300) {
          alert("Quiz updated successfully!");
        }
      } else {
        const response = await axiosInstance.post(`/api/quiz`, quizData);
        if (response.status >= 200 && response.status < 300) {
          alert("Quiz added successfully!");
        }
      }
      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error("Error submitting quiz:", error.response || error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await axiosInstance.delete(`/api/quiz/${quizId}`);
      if (response.status >= 200 && response.status < 300) {
        alert("Quiz deleted successfully!");
        fetchQuizzes(); // Refresh the quiz list
      }
    } catch (error) {
      console.error("Error deleting quiz:", error.response || error);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h3>Quizzes for Course ID: {courseId}</h3>
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.quiz_id}>
              <strong>{quiz.title}</strong> - {quiz.question}
              <button onClick={() => handleEdit(quiz)}>Edit</button>
              <button onClick={() => handleDelete(quiz.quiz_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>{quizId ? "Update Quiz" : "Add Quiz"}</h3>

        <label>
          Quiz Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Question:
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          ></textarea>
        </label>

        <div>
          <h4>Answers:</h4>
          {answers.map((answer, idx) => (
            <div key={idx}>
              <label>
                Answer {idx + 1}:
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  required
                />
              </label>
            </div>
          ))}
        </div>

        <label>
          Correct Answer:
          <select
            value={correctAnswer !== null ? correctAnswer : ""}
            onChange={(e) => setCorrectAnswer(Number(e.target.value))}
            required
          >
            <option value="">Select Correct Answer</option>
            {answers.map((_, idx) => (
              <option key={idx} value={idx}>
                Answer {idx + 1}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">{quizId ? "Update Quiz" : "Add Quiz"}</button>
      </form>
    </>
  );
};

export default QuizForm;
