import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard.js';
import axiosInstance from '../../axiosconfig';
import { useAuth } from '../../Context/auth';
import Navbar from '../Home/NavBar.js';
import Footer from '../Home/Footer.js';
import noContent from './we.png';
import { 
    Container, 
    Grid, 
    Typography, 
    Box, 
    Button,
    Card,
    CardContent,
    Avatar,
    Stack,
    CircularProgress
} from '@mui/material';
import { School, TrendingUp, EmojiEvents, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [auth] = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = auth?.user?.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userId) return;

      try {
        const response = await axiosInstance.get(`/api/enrollments/user/${userId}`);
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Error fetching enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId, auth]);

  if (loading) return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
      </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
    <Navbar/>
    
    {/* Dashboard Hero */}
    <Box sx={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', 
        color: '#fff', 
        py: { xs: 4, md: 6 } 
    }}>
        <Container maxWidth="xl">
            <Grid container alignItems="center" spacing={4}>
                <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: '#A435F0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {auth?.user?.full_name?.charAt(0) || "S"}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="800" fontFamily="Inter">
                                Welcome back, {auth?.user?.full_name?.split(' ')[0] || "Student"}!
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.8, fontFamily: "Inter" }}>
                                specific quote or motivation here.
                                "Education is the passport to the future." 
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#fff', borderRadius: 2 }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Box textAlign="center">
                                <Typography variant="h4" fontWeight="bold">{courses.length}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Courses Enrolled</Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h4" fontWeight="bold">0</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Completed</Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h4" fontWeight="bold">0</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Certificates</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    </Box>

    <Container maxWidth="xl" sx={{ flexGrow: 1, py: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="700" fontFamily="Inter" color="#1E293B">
                My Learnings
            </Typography>
            {courses.length > 0 && (
                <Button endIcon={<ArrowForward />} sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
                    View Archive
                </Button>
            )}
        </Box>

      {courses.length === 0 ? (
         <Box sx={{ 
             textAlign: 'center', 
             py: 8, 
             bgcolor: '#fff', 
             borderRadius: 4, 
             border: '1px dashed #E2E8F0',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center'
         }}>
             <img src={noContent} style={{ maxWidth: "300px", marginBottom: "2rem" }} alt="No enrollments" />
             <Typography variant="h5" fontWeight="600" color="#334155" gutterBottom fontFamily="Inter">
                 You haven't enrolled in any courses yet.
             </Typography>
             <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500 }} fontFamily="Inter">
                 Start your learning journey today by browsing our catalogue of top-rated courses.
             </Typography>
             <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate('/')}
                sx={{ 
                    bgcolor: "#1E293B", 
                    py: 1.5, 
                    px: 4, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: "Inter"
                }}
             >
                 Browse Courses
             </Button>
         </Box>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.enrollment_id}>
                <CourseCard 
                  course={course} 
                  userId={userId} 
                />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    <Footer/>
    </Box>
  );
};

export default StudentDashboard;
