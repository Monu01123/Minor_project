import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosconfig';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import CategoryList from './Categorylist';
import Footer from "./Footer.js";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Rating,
  useTheme,
  Stack,
  Skeleton,
  Avatar
} from '@mui/material';
import {
  AccessTime,
  SignalCellularAlt,
  PlayCircleFilled,
  VerifiedUser,
  School,
  AllInclusive,
  ArrowForward,
  PortraitRounded as PortraitRoundedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Hero Section Component
const HeroSection = () => {
    return (
        <Box 
            sx={{ 
                background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", 
                pt: { xs: 4, md: 8 }, 
                pb: { xs: 6, md: 10 },
                position: "relative",
                overflow: "hidden"
            }}
        >
             {/* Decorative blob */}
             <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'rgba(102, 126, 234, 0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />

            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <Chip label="🚀 Start Learning Today" color="primary" sx={{ mb: 2, bgcolor: "rgba(102, 126, 234, 0.1)", color: "#667eea", fontWeight: "bold" }} />
                            <Typography variant="h2" fontWeight="800" sx={{ background: "linear-gradient(45deg, #2c3e50 30%, #4ca1af 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 2, lineHeight: 1.2 }}>
                                Unlock Your Potential with Online Courses
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                Gain new skills from industry experts. Choose from over 10,000+ courses and start your journey to success.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" size="large" sx={{ px: 4, py: 1.5, borderRadius: "50px", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", boxShadow: "0 10px 20px rgba(118, 75, 162, 0.3)" }}>
                                    Get Started
                                </Button>
                                <Button variant="outlined" size="large" startIcon={<PlayCircleFilled />} sx={{ px: 3, py: 1.5, borderRadius: "50px", borderColor: "#667eea", color: "#667eea" }}>
                                    Watch Demo
                                </Button>
                            </Stack>
                             <Box sx={{ mt: 5, display: "flex", gap: 4 }}>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">10k+</Typography>
                                    <Typography variant="body2" color="text.secondary">Active Students</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">500+</Typography>
                                    <Typography variant="body2" color="text.secondary">Expert Instructors</Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
                         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                            {/* Placeholder for 3D Graphic - Replace with actual asset */}
                            <img 
                                src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg?w=826&t=st=1706705500~exp=1706706100~hmac=6c507c58850616858e8093a55875220c" 
                                alt="Learning Illustration" 
                                style={{ width: "100%", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                            />
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

// Features Section
const Features = () => {
    const features = [
        { icon: <VerifiedUser fontSize="large" sx={{color: "#4ca1af"}}/>, title: "Certified Courses", desc: "Earn certificates recognized by top companies." },
        { icon: <School fontSize="large" sx={{color: "#667eea"}}/>, title: "Expert Instructors", desc: "Learn from industry professionals and experts." },
        { icon: <AllInclusive fontSize="large" sx={{color: "#764ba2"}}/>, title: "Lifetime Access", desc: "Access your courses anywhere, anytime, forever." },
    ];

    return (
        <Container sx={{ py: 8 }}>
            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card elevation={0} sx={{ textAlign: "center", p: 3, bgcolor: "transparent", transition: "transform 0.3s", "&:hover": { transform: "translateY(-10px)" } }}>
                            <Box sx={{ display: "inline-flex", p: 2, bgcolor: "rgba(102, 126, 234, 0.1)", borderRadius: "50%", mb: 2 }}>
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};


const HomePage = () => {
  const { categoryId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            // Default to category 1 if no param, or use param. Logic can involve "Popular" endpoint ideally.
            const fetchId = categoryId || 1; 
            
            // Note: In a real app, you might want a specific endpoint for "HomePage Featured Courses" 
            // instead of just category 1, but preserving original logic for now.
            const response = await axiosInstance.get(`/api/courses/category/${fetchId}`);
            if (isMounted) {
                setCourses(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            if (isMounted) { 
                setError("Unable to load courses. Please check your connection.");
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    fetchCourses();

    return () => { isMounted = false; };
  }, [categoryId]);

  const formatTitle = (title) => {
    return title.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Category Horizontal List */}
      <CategoryList />

       {/* Features */}
       <Features />

       {/* Courses Grid */}
      <Container sx={{ pb: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          {categoryId ? "Explore Courses" : "Popular Courses"}
        </Typography>

        {loading ? (
           <Grid container spacing={4}>
              {[1, 2, 3, 4].map((n) => (
                  <Grid item xs={12} sm={6} md={3} key={n}>
                      <Skeleton variant="rectangular" height={200} sx={{borderRadius: 2}} />
                      <Skeleton />
                      <Skeleton width="60%" />
                  </Grid>
              ))}
           </Grid>
        ) : error ? (
            <Box textAlign="center" py={5}>
                <Typography color="error" variant="h6" gutterBottom>{error}</Typography>
                <Button variant="outlined" onClick={() => window.location.reload()}>Retry</Button>
            </Box>
        ) : (
            <Grid container spacing={4}>
            {courses.map(course => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.course_id}>
                     <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card 
                            component={NavLink}
                            to={`/courses/${course.course_id}`}
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 4,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                                overflow: "visible", // For floating elements if any, but kept hidden for clean cut
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
                                    {course.category_name || "Development"} {/* Fallback if category name exists */}
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
                                    {/* <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#999' }}>₹1999</Typography> */}
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

export default HomePage;
