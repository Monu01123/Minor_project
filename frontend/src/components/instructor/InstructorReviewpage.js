import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Home/NavBar";

const InstructorCourseReviewsPage = () => {
  const { courseId, instructorId } = useParams(); 
  const location = useLocation();
  const courseTitle = location.state?.courseTitle || "Course"; // Get the course title
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/reviews/course/${courseId}/instructor/${instructorId}`
        );
        setReviews(response.data);
      } catch (err) {
        setError("Error fetching reviews");
        console.error(err);
      }
    };
    fetchReviews();
  }, [courseId, instructorId]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review.review_id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete the review");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h2>Reviews for {courseTitle}</h2>
        {error && <p>{error}</p>}
        {reviews.length === 0 ? (
          <p>No reviews found for this course.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.review_id}>
                  <td>{review.user_id}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>
                    <button onClick={() => handleDeleteReview(review.review_id)}>
                      Delete Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default InstructorCourseReviewsPage;
