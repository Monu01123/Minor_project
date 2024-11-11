import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Home/NavBar.js";
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from "./../Home/Footer.js";

const InstructorCourseReviewsPage = () => {
  const { courseId, instructorId } = useParams();
  const location = useLocation();
  const courseTitle = location.state?.courseTitle || "Course";
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
      <div className="reviews-container">
        <h2 className="reviews-header">Reviews for {courseTitle}</h2>
        {error && <p className="reviews-error">{error}</p>}
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews found for this course.</p>
        ) : (
          <table className="reviews-table">
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
                  <td data-label="User ID">{review.user_id}</td>
                  <td data-label="Rating">{review.rating}</td>
                  <td data-label="Comment" className="instructor-comment"><span style={{width:"20px"}}></span>{review.comment}</td>
                  <td data-label="Actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteReview(review.review_id)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default InstructorCourseReviewsPage;
