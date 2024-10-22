import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./HomePage.css";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const Reviews = () => {
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reviews/course/${courseId}`
        );

        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setReviews(response.data);
          setError(null);
        } else {
          setError("Unexpected data format received.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setReviews([]);
            setError(null);
          } else {
            console.error("Error fetching reviews:", error.response.data);
            setError("Failed to fetch reviews. Please try again later.");
          }
        } else {
          console.error("Error fetching reviews:", error.message);
          setError("Failed to fetch reviews. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="reviews-container">
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.review_id} className="review-card">
            <div className="review-header">
              <div className="review-rating">
                <AccountCircleRoundedIcon color="disabled" fontSize="large" />
                <span className="review-user">{review.user_name}</span>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <span className="review-date">
                Reviewed on {formatDate(review.created_at)}
              </span>
            </div>
            <div className="review-comment">
              <p>{review.comment}</p>
            </div>
          </div>
        ))
      ) : (
        <p>
          No reviews available for this course. Be the first to leave a review!
        </p>
      )}
    </div>
  );
};

export default Reviews;
