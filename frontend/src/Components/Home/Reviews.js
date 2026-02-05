import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  Avatar,
  Rating,
  Pagination,
  Card,
  CardContent,
  Divider,
  Container,
  Grid
} from "@mui/material";
import { deepOrange, deepPurple, teal, indigo, blueGrey } from "@mui/material/colors";

const Reviews = () => {
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
<<<<<<< HEAD:frontend/src/components/Home/Reviews.js
        const response = await axiosInstance.get(
          `/api/reviews/course/${courseId}`
=======
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/reviews/course/${courseId}`
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Reviews.js
        );

        if (Array.isArray(response.data)) {
          setReviews(response.data);
          setError(null);
        } else {
          setReviews([]); // Handle empty or malformed
        }
      } catch (error) {
         // Gracefully handle 404 (no reviews)
         if (error.response && error.response.status === 404) {
            setReviews([]);
         } else {
            console.error("Error fetching reviews:", error);
         }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  // Calculations for Summary
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
      if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  // Filter Logic
  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  // Pagination Logic
  const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
  const displayedReviews = filteredReviews.slice(
      (currentPage - 1) * reviewsPerPage,
      currentPage * reviewsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getUserColor = (name) => {
      const colors = [deepOrange[500], deepPurple[500], teal[500], indigo[500], blueGrey[500]];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Typography sx={{py:4}}>Loading reviews...</Typography>;

  return (
<<<<<<< HEAD:frontend/src/components/Home/Reviews.js
    <Box id="reviews" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Student Feedback
      </Typography>
=======
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
                  <span className="percentage">
                    {isNaN(percentage) ||
                    percentage === null ||
                    percentage === undefined
                      ? "0"
                      : percentage.toFixed(1)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </section>
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Reviews.js

      <Grid container spacing={6}>
          {/* Summary Section */}
          <Grid item xs={12} md={4}>
              <Box sx={{ p: 0 }}>
                  <Typography variant="h2" fontWeight="800" color="#b4690e" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {averageRating}
                      <Typography variant="caption" sx={{ fontSize: '1rem', color: 'text.secondary', fontWeight: 400 }}>
                          course rating
                      </Typography>
                  </Typography>
                  <Rating value={Number(averageRating)} precision={0.1} readOnly size="medium" sx={{ mb: 2 }} />
                  
                  <Stack spacing={1}>
                      {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingCounts[star];
                          const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                          return (
                              <Box 
                                key={star} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2, 
                                    cursor: 'pointer',
                                    opacity: filterRating && filterRating !== star ? 0.4 : 1,
                                    '&:hover': { opacity: 0.8 } 
                                }}
                                onClick={() => setFilterRating(filterRating === star ? null : star)}
                              >
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={percent} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4, 
                                        flexGrow: 1,
                                        bgcolor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#8a8a8a' 
                                        }
                                    }} 
                                  />
                                  <Rating value={star} count={5} readOnly size="small" sx={{display: 'none'}} /> {/* Hidden literal stars for bar logic if needed, but using bar instead */}
                                  <Box display="flex" minWidth={80} justifyContent="space-between">
                                      <Rating value={star} max={5} readOnly size="small" sx={{ fontSize: '1rem', color: '#b4690e', '& .MuiRating-iconEmpty': {display: 'none'} }} />
                                      <Typography variant="body2" color="text.secondary" sx={{ml:1, minWidth: '30px', textAlign: 'right'}}>{Math.round(percent)}%</Typography>
                                  </Box>
                              </Box>
                          );
                      })}
                  </Stack>
                  {filterRating && (
                      <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ mt: 2, cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setFilterRating(null)}
                      >
                          Clear Filter (Showing {filterRating} stars)
                      </Typography> // Fix: properly clear filter
                  )}
              </Box>
          </Grid>

          {/* Reviews List */}
          <Grid item xs={12} md={8}>
              {displayedReviews.length > 0 ? (
                  <Stack spacing={3}>
                      {displayedReviews.map((review) => (
                          <Box key={review.review_id}>
                              <Divider sx={{ mb: 3 }} />
                              <Box display="flex" gap={2}>
                                  <Avatar 
                                    sx={{ 
                                        bgcolor: getUserColor(review.user_name || "U"), 
                                        width: 48, 
                                        height: 48,
                                        fontSize: '1.2rem'
                                    }}
                                  >
                                      {(review.user_name || "A").charAt(0).toUpperCase()}
                                  </Avatar>
                                  <Box>
                                      <Typography variant="subtitle1" fontWeight="bold">
                                          {review.user_name || "Anonymous User"}
                                      </Typography>
                                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                          <Rating value={review.rating} readOnly size="small" sx={{ color: '#b4690e' }} />
                                          <Typography variant="body2" color="text.secondary">
                                              {formatDate(review.created_at)}
                                          </Typography>
                                      </Stack>
                                      <Typography variant="body1" color="#2d2f31">
                                          {review.comment}
                                      </Typography>
                                  </Box>
                              </Box>
                          </Box>
                      ))}
                      
                      {pageCount > 1 && (
                          <Box display="flex" justifyContent="center" mt={4}>
                              <Pagination 
                                count={pageCount} 
                                page={currentPage} 
                                onChange={handlePageChange} 
                                color="primary" 
                                shape="rounded"
                              />
                          </Box>
                      )}
                  </Stack>
              ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                          No reviews found {filterRating ? `for ${filterRating} stars` : "yet"}.
                      </Typography>
                  </Box>
              )}
          </Grid>
      </Grid>
    </Box>
  );
};

export default Reviews;
