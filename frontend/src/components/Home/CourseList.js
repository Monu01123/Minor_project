import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosconfig.js';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Navbar from './NavBar.js';
import CategoryList from './Categorylist';
import Footer from './Footer';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Rating,
  Stack,
  Skeleton,
  Avatar,
  Button
} from '@mui/material';
import {
  SignalCellularAlt,
  School,
  ArrowForward,
  PortraitRounded as PortraitRoundedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CourseList = () => {
  const { categoryId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/api/courses/category/${categoryId}`)
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, [categoryId]);

  const formatTitle = (title) => {
    return title ? title.replace(/\b\w/g, (char) => char.toUpperCase()) : "";
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <CategoryList />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" fontWeight="800" mb={4} sx={{ color: "#2c3e50" }}>
           Courses
        </Typography>

        {loading ? (
           <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <Grid item xs={12} sm={6} md={3} key={n}>
                      <Skeleton variant="rectangular" height={220} sx={{borderRadius: 4}} />
                      <Box sx={{ pt: 1 }}>
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                      </Box>
                  </Grid>
              ))}
           </Grid>
        ) : courses.length === 0 ? (
            <Box textAlign="center" py={10}>
                <Typography variant="h5" color="text.secondary">No courses found in this category.</Typography>
                <Button variant="outlined" sx={{mt: 2}} onClick={() => navigate('/')}>Go Back Home</Button>
            </Box>
        ) : (
            <Grid container spacing={4}>
            {courses.map(course => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.course_id}>
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card 
                            component={NavLink}
                            to={`/courses/${course.course_id}`}
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 4,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                                overflow: "visible", 
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                border: "1px solid rgba(0,0,0,0.05)",
                                textDecoration: 'none',
                                position: 'relative',
                                bgcolor: '#fff',
                                '&:hover': {
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                                    transform: "translateY(-5px)"
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={course.image_url}
                                    alt={course.title}
                                    sx={{ 
                                        borderTopLeftRadius: 16, 
                                        borderTopRightRadius: 16,
                                        objectFit: 'cover'
                                    }}
                                />
                                <Chip 
                                    label={formatTitle(course.level || "Beginner")} 
                                    size="small" 
                                    icon={<SignalCellularAlt fontSize="small" />}
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 12, 
                                        left: 12, 
                                        bgcolor: "rgba(255, 255, 255, 0.95)", 
                                        backdropFilter: 'blur(4px)',
                                        color: "#333", 
                                        fontWeight: 700, 
                                        fontSize: "0.75rem",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                                    }} 
                                />
                                <Box 
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: -20, 
                                        right: 16, 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '50%', 
                                        bgcolor: 'white', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <PortraitRoundedIcon color="primary" />
                                </Box>
                            </Box>

                            <CardContent sx={{ pt: 3, px: 2.5,  flexGrow: 1 }}>
                                <Typography variant="caption" color="primary" fontWeight="bold" sx={{ letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    {course.category_name || "Development"} 
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    fontWeight="800" 
                                    gutterBottom 
                                    sx={{ 
                                        lineHeight: 1.3, 
                                        height: "2.6em", 
                                        overflow: "hidden", 
                                        mt: 1,
                                        color: "#1a2b3c",
                                        fontSize: "1.05rem"
                                    }}
                                >
                                    {course.title.length > 50 ? `${course.title.substring(0, 50)}...` : course.title}
                                </Typography>
                                
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <Rating value={4.5} precision={0.5} size="small" readOnly sx={{ fontSize: "0.9rem" }} />
                                    <Typography variant="body2" color="text.secondary" fontWeight="500" sx={{ fontSize: "0.8rem" }}>
                                        (4.5)
                                    </Typography>
                                    <Box sx={{ width: 4, height: 4, bgcolor: '#ccc', borderRadius: '50%' }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                                        12k students
                                    </Typography>
                                </Stack>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'transparent', color: '#666' }}><School sx={{fontSize: 16}}/></Avatar>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                                        {formatTitle(course.instructor_name || "Instructor")}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ p: 2.5, pt: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0' }}>
                                <Box>
                                    <Typography variant="h6" color="#007791" fontWeight="900">
                                        ₹499
                                    </Typography>
                                </Box>
                                <Button size="small" variant="text" endIcon={<ArrowForward fontSize="small" />} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
            </Grid>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default CourseList;
