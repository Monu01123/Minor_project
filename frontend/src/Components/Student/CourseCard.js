import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { useNavigate } from "react-router-dom";
import { 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions, 
    Typography, 
    Button, 
    Box, 
    LinearProgress, 
    Rating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Stack
} from "@mui/material";
import { PlayCircleOutline, RateReview, CheckCircle } from "@mui/icons-material";

const CourseCard = ({ course, userId }) => {
  const navigate = useNavigate();
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState(""); 
  const [existingReview, setExistingReview] = useState(null); 
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const fetchEnrollmentCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/courses/${course.course_id}/enrollment-count`
        );
        setEnrollmentCount(response.data.enrollmentCount);
      } catch (err) {
        console.error("Error fetching enrollment count:", err);
      }
    };

    const fetchExistingReview = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/reviews/course/${course.course_id}/user/${userId}`
        );
        if (response.data.length > 0) {
          setExistingReview(response.data[0]); 
          setRating(response.data[0].rating);
          setComment(response.data[0].comment);
        }
      } catch (err) {
        console.error("Error fetching existing review:", err);
      }
    };

    fetchEnrollmentCount();
    fetchExistingReview();
  }, [course.course_id, userId]);

  const handleReviewSubmit = async () => {
    setLoadingReview(true);
    try {
      await axiosInstance.post("/api/reviews", {
        user_id: userId,
        course_id: course.course_id,
        rating,
        comment,
      });
      
      setExistingReview({ rating, comment }); 
      setOpenReviewDialog(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      // Ideally show an error snackbar here
    } finally {
        setLoadingReview(false);
    }
  };

  return (
    <>
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            },
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}>
        <Box sx={{ position: 'relative' }}>
            <CardMedia
                component="img"
                height="160"
                image={course.image_url || "https://source.unsplash.com/random?coding"}
                alt={course.title}
            />
            <Chip 
                label={course.category_name || "Development"} 
                size="small" 
                sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)'
                }} 
            />
            {/* Mock Progress Bar overlay */}
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <LinearProgress variant="determinate" value={45} sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} />
            </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
            <Typography gutterBottom variant="h6" component="div" fontWeight="700" fontFamily="Inter" sx={{ lineHeight: 1.3, mb: 1 }}>
                {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontFamily="Inter" sx={{ mb: 2 }}>
                Instructed by {course.instructor_name || "Expert Instructor"}
            </Typography>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: "#64748B", fontFamily: "Inter", fontWeight: 500 }}>
                    {enrollmentCount} classmates
                </Typography>
                {existingReview && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                         <CheckCircle fontSize="small" color="success" sx={{ width: 16, height: 16 }} />
                         <Typography variant="caption" color="success.main" fontWeight="600">Reviewed</Typography>
                    </Box>
                )}
            </Stack>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
            <Button 
                variant="contained" 
                fullWidth 
                startIcon={<PlayCircleOutline />}
                onClick={() => navigate(`/courses-content/${course.course_id}`, { state: { courseName: course.title } })}
                sx={{ 
                    bgcolor: "#0F172A", 
                    color: "#fff", 
                    fontWeight: "600",
                    textTransform: 'none',
                    py: 1,
                    borderRadius: 2,
                    fontFamily: "Inter",
                    '&:hover': { bgcolor: "#1E293B" }
                }}
            >
                Continue Learning
            </Button>
            <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<RateReview />}
                onClick={() => setOpenReviewDialog(true)}
                size="small"
                sx={{ 
                    borderColor: "#E2E8F0", 
                    color: "#64748B",
                    textTransform: 'none',
                    borderRadius: 2,
                    fontFamily: "Inter",
                    '&:hover': { borderColor: "#94A3B8", color: "#334155" }
                }}
            >
                {existingReview ? "Edit Review" : "Leave a Review"}
            </Button>
        </CardActions>
        </Card>

        {/* Review Dialog */}
        <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontFamily: "Inter", fontWeight: 700 }}>
                {existingReview ? "Edit Your Review" : "Rate this Course"}
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3} sx={{ py: 1 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Typography component="legend" fontFamily="Inter">How would you rate this course?</Typography>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            size="large"
                        />
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comment"
                        label="Share your experience"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like? What could be improved?"
                        InputProps={{ sx: { fontFamily: "Inter" } }}
                        InputLabelProps={{ sx: { fontFamily: "Inter" } }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={() => setOpenReviewDialog(false)} sx={{ fontFamily: "Inter", color: "#64748B" }}>Cancel</Button>
                <Button 
                    onClick={handleReviewSubmit} 
                    variant="contained" 
                    disabled={loadingReview || !rating}
                    sx={{ 
                        fontFamily: "Inter", 
                        bgcolor: "#A435F0", 
                        '&:hover': { bgcolor: "#8710D8" } 
                    }}
                >
                    {loadingReview ? "Submitting..." : "Submit Review"}
                </Button>
            </DialogActions>
        </Dialog>
    </>
  );
};

export default CourseCard;
