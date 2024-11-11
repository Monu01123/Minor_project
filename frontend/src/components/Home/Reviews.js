import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./HomePage.css";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const Reviews = () => {
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reviews/course/${courseId}`
        );

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

  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0];

  reviews.forEach((review) => {
    ratingCounts[5 - review.rating]++;
  });

  const ratingPercentages = ratingCounts.map(
    (count) => (count / totalReviews) * 100
  );

  const filteredReviews = selectedRatingFilter
    ? reviews.filter((review) => review.rating === selectedRatingFilter)
    : reviews;

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleRatingFilterChange = (rating) => {
    setSelectedRatingFilter(rating);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="reviews-container">
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <main className="Review-flex">
          <section>
            <div className="rating-distribution">
              <button onClick={() => handleRatingFilterChange(null)}>
                All Reviews
              </button>
              {ratingPercentages.map((percentage, index) => (
                <div
                  key={index}
                  className="rating-bar"
                  onClick={() => handleRatingFilterChange(5 - index)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="stars">
                    {"★".repeat(5 - index)}
                    {"☆".repeat(index)}
                  </span>
                  <div className="bar">
                    <div
                      className="filled-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="percentage">{percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <div key={review.review_id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      <AccountCircleRoundedIcon
                        color="disabled"
                        fontSize="large"
                      />
                      <div>
                        <span className="review-user">{review.user_name}</span>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
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
              <p>No reviews found for the selected rating.</p>
            )}
            <div className="pagination-controls">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage}</span>
              <button
                onClick={handleNextPage}
                disabled={endIndex >= filteredReviews.length}
              >
                Next
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Reviews;
