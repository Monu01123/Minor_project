import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Home/NavBar.js";
import Footer from "./../Home/Footer.js";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Chip
} from "@mui/material";
import { Delete, Star, RateReview, Person } from "@mui/icons-material";

const InstructorCourseReviewsPage = () => {
  const { courseId, instructorId } = useParams();
  const location = useLocation();
  const courseTitle = location.state?.courseTitle || "Course";
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/reviews/course/${courseId}/instructor/${instructorId}`
        );
        setReviews(response.data);
      } catch (err) {
        setError("Error fetching reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId, instructorId]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review.review_id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete the review");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Navbar />
      
      <Box sx={{ bgcolor: '#0F172A', py: 4, color: 'white', mb: 4 }}>
          <Container maxWidth="lg">
              <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 1 }}>Review Management</Typography>
              <Typography variant="h4" fontWeight="bold" fontFamily="Inter">
                  {courseTitle}
              </Typography>
          </Container>
      </Box>

      <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Box display="flex" alignItems="center" mb={3} gap={2}>
                <RateReview color="primary" sx={{ fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold" fontFamily="Inter">
                    Student Reviews ({reviews.length})
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
            ) : reviews.length === 0 ? (
                <Box textAlign="center" py={6} bgcolor="#F8FAFC" borderRadius={2}>
                    <Typography color="text.secondary">No reviews found for this course yet.</Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.review_id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#A435F0', fontSize: 14 }}>
                                                {review.user_id ? review.user_id.toString().substring(0,2) : <Person />}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight="500">
                                                User {review.user_id}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            icon={<Star sx={{ fontSize: '14px !important' }} />} 
                                            label={review.rating} 
                                            size="small" 
                                            color="warning" 
                                            variant="outlined" 
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 400 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {review.comment}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton 
                                            onClick={() => handleDeleteReview(review.review_id)} 
                                            color="error" 
                                            size="small"
                                            title="Delete Review"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default InstructorCourseReviewsPage;
