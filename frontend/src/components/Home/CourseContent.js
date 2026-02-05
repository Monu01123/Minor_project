import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./NavBar.js";
import Reviews from "./Reviews.js";
import Footer from "./Footer.js";
import { useAuth } from "../../Context/auth.js";
import axiosInstance from "../../axiosconfig.js";
import { useCart } from "./CartContext.js";
import { useWishlist } from "./WishlistContext.js";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Chip,
  Skeleton,
  IconButton
} from "@mui/material";
import {
  TranslateRounded,
  Grade,
  FavoriteBorder,
  Favorite,
  PlayCircleOutline,
  ExpandMore,
  CheckCircleOutline,
  AccessTime,
  AllInclusive,
  EmojiEvents,
  VerifiedUser,
  NavigateNext
} from "@mui/icons-material";
import { motion } from "framer-motion";

const CourseContent = () => {
  const { courseId } = useParams();
  const { updateCartCount } = useCart();
  const { updateWishlistCount } = useWishlist();
  const [courseDetails, setCourseDetails] = useState(null);
  const [content, setContent] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Course Details
        const detailsRes = await axiosInstance.get(`/api/courses/${courseId}`);
        setCourseDetails(detailsRes.data);

        // Fetch Course Content (Syllabus) - Assuming public or check if token needed
        // The original code only passed token if available, but let's see. 
        // Original code used `api/content/enrolled/${courseId}` which sounds like it needs enrollment?
        // But usually syllabus is visible. Let's try the same endpoint.
        const token = auth?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            const contentRes = await axiosInstance.get(`api/content/enrolled/${courseId}`, { headers });
            setContent(contentRes.data.length ? contentRes.data : []);
        } catch (err) {
            console.warn("Could not fetch full content (likely not enrolled)", err);
            // Fallback or empty if not allowed
            setContent([]); 
        }

        // User specific checks
        if (auth?.user?.user_id) {
            const userId = auth.user.user_id;
             // Check Enrollment
             try {
                const enrollRes = await axiosInstance.get(`/api/enrollments/user/${userId}`, { headers });
                const enrolledCourses = enrollRes.data.map(e => e.course_id);
                setEnrolled(enrolledCourses.includes(Number(courseId)));
             } catch (e) {
                 console.error("Enrollment check failed", e);
             }

             // Update Cart/Wishlist Counts (Moving logic here from render body)
             try {
                const cartRes = await axiosInstance.get(`/api/cart/count/${userId}`);
                updateCartCount(cartRes.data.count || 0);

                const wishRes = await axiosInstance.get(`/api/wishlist/count/${userId}`);
                updateWishlistCount(wishRes.data.wishlist_count || 0);
             } catch (e) {
                 console.error("Count fetch failed", e);
             }
        }

      } catch (error) {
        console.error("Error loading course page:", error);
        setCourseDetails(null); // Ensure null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, auth, updateCartCount, updateWishlistCount]);


  const AddToCart = async () => {
    if (!auth?.user?.user_id) {
      alert("Please log in to add to cart.");
      navigate('/login');
      return;
    }
    try {
      await axiosInstance.post("/api/cart", {
        user_id: auth.user.user_id,
        course_id: courseId,
      });
      // Refresh count
       const res = await axiosInstance.get(`/api/cart/count/${auth.user.user_id}`);
       updateCartCount(res.data.count || 0);
       alert("Added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Could not add to cart");
    }
  };

  const AddToWishlist = async () => {
    if (!auth?.user?.user_id) {
      alert("Please log in to add to wishlist.");
      navigate('/login');
      return;
    }
    try {
        await axiosInstance.post("/api/wishlist", {
            user_id: auth.user.user_id,
            course_id: courseId,
        });
        setIsInWishlist(true); // Optimistic update
        const res = await axiosInstance.get(`/api/wishlist/count/${auth.user.user_id}`);
        updateWishlistCount(res.data.wishlist_count || 0);
        alert("Added to wishlist!");
    } catch (error) {
        alert(error.response?.data?.message || "Could not add to wishlist");
    }
  };

  const handleOpenCourseContentPage = () => {
    navigate(`/courses-content/${courseId}`, {
      state: { courseName: courseDetails?.title },
    });
  };

  const formatLevel = (lvl) => lvl ? lvl.charAt(0).toUpperCase() + lvl.slice(1).toLowerCase() : "All Levels";

  const LoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
                <Skeleton height={40} width="60%" sx={{ mb: 2 }} />
                <Skeleton height={20} width="100%" sx={{ mb: 1 }} />
                <Skeleton height={20} width="100%" sx={{ mb: 1 }} />
                <Skeleton height={20} width="80%" sx={{ mb: 4 }} />
            </Grid>
            <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
        </Grid>
    </Container>
  );

  if (loading) return <><Navbar /><LoadingSkeleton /><Footer /></>;
  if (!courseDetails) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Container sx={{ py: 10, textAlign: 'center', flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom fontFamily="Inter">Course not found</Typography>
            <Typography color="text.secondary" fontFamily="Inter">We couldn't find the course with ID: <strong>{courseId}</strong></Typography>
            <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 3, fontFamily: 'Inter' }}>Go Home</Button>
        </Container>
        <Footer />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#F5F7FA", minHeight: "100vh", fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      
      {/* Premium Hero Section */}
      <Box sx={{ 
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", 
          color: "#fff", 
          py: { xs: 5, md: 8 },
          position: "relative",
          overflow: "hidden"
      }}>
        {/* Subtle background decoration */}
        <Box sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 400, 
            height: 400, 
            background: 'radial-gradient(circle, rgba(164, 53, 240, 0.15) 0%, rgba(0,0,0,0) 70%)', 
            borderRadius: '50%',
            filter: 'blur(40px)' 
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{color: '#94A3B8'}}/>} aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link to="/" style={{ color: '#CBD5E1', textDecoration: 'none', fontFamily: 'Inter', fontSize: '0.875rem' }}>Home</Link>
                <Link to={`/category/${courseDetails.category_id || 1}`} style={{ color: '#CBD5E1', textDecoration: 'none', fontFamily: 'Inter', fontSize: '0.875rem' }}>
                    {courseDetails.category_name || "Development"}
                </Link>
                <Typography color="#E2E8F0" fontFamily="Inter" fontSize="0.875rem">{courseDetails.title}</Typography>
            </Breadcrumbs>

            <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h2" fontWeight="800" sx={{ 
                        mb: 2, 
                        fontSize: { xs: "2rem", md: "3rem" },
                        fontFamily: "Inter, sans-serif",
                        lineHeight: 1.2,
                        textShadow: "0px 2px 4px rgba(0,0,0,0.3)"
                    }}>
                        {courseDetails.title}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                        mb: 4, 
                        opacity: 0.9, 
                        fontWeight: 300, 
                        lineHeight: 1.6,
                        fontFamily: "Inter, sans-serif",
                        color: "#E2E8F0",
                        maxWidth: "90%"
                    }}>
                        {courseDetails.description && courseDetails.description.length > 200 
                            ? courseDetails.description.substring(0, 200) + "..." 
                            : courseDetails.description}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }}>
                        {courseDetails.average_rating && (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography fontWeight="800" color="#FACC15" fontFamily="Inter" fontSize="1.1rem">{Number(courseDetails.average_rating).toFixed(1)}</Typography>
                                <Rating value={Number(courseDetails.average_rating)} precision={0.5} readOnly size="small" />
                                <Typography variant="caption" sx={{ color: "#94A3B8", textDecoration: 'underline', fontFamily: 'Inter' }}>(1,234 ratings)</Typography>
                            </Box>
                        )}
                         <Box display="flex" alignItems="center" gap={1}>
                             <VerifiedUser fontSize="small" sx={{ color: "#A435F0" }} />
                             <Typography variant="body2" fontFamily="Inter" fontWeight="500">{courseDetails.enrollment_count || 0} students</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" gap={1}>
                             <TranslateRounded fontSize="small" sx={{ color: "#CBD5E1" }} />
                             <Typography variant="body2" fontFamily="Inter">{courseDetails.language || "English"}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" sx={{ color: "#CBD5E1" }} />
                            <Typography variant="body2" fontFamily="Inter">Last updated {new Date().toLocaleDateString()}</Typography>
                         </Box>
                    </Stack>

                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src="https://i.pravatar.cc/150?img=12" sx={{ width: 44, height: 44, border: "2px solid #fff" }} />
                        <Box>
                            <Typography variant="body2" color="#94A3B8" fontFamily="Inter">Created by</Typography>
                            <Link to="#" style={{ color: "#A435F0", fontWeight: "700", textDecoration: "none", fontFamily: "Inter" }}>
                                {courseDetails.instructor_name}
                            </Link>
                        </Box>
                    </Box>
                </Grid>
                {/* Right side logic handled in Main Content Grid for layout structure, technically empty here to allow sticky card below */}
            </Grid>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={6}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
                
                {/* What you'll learn */}
                <Box sx={{ 
                    border: "1px solid #E2E8F0", 
                    p: 4, 
                    mb: 4, 
                    bgcolor: "#fff", 
                    borderRadius: 3, 
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.02)" 
                }}>
                    <Typography variant="h5" fontWeight="700" fontFamily="Inter" gutterBottom sx={{ mb: 3 }}>What you'll learn</Typography>
                    <Grid container spacing={2}>
                         {[1,2,3,4].map((i) => (
                             <Grid item xs={12} sm={6} key={i}>
                                 <Box display="flex" gap={1.5} alignItems="flex-start">
                                    <CheckCircleOutline sx={{ fontSize: 22, color: "#10B981", mt: 0.3 }} />
                                    <Typography variant="body2" color="#334155" fontFamily="Inter" lineHeight={1.6}>Master the core concepts of the subject efficiently.</Typography>
                                 </Box>
                             </Grid>
                         ))}
                    </Grid>
                </Box>

                {/* Course Content Accordion */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" fontWeight="700" fontFamily="Inter" gutterBottom sx={{ mb: 2 }}>Course Content</Typography>
                    <Typography variant="body2" color="text.secondary" fontFamily="Inter" sx={{ mb: 3 }}>
                        {content.length} sections • {content.length * 5} lectures • 12h 30m total length
                    </Typography>
                    
                    {content.length > 0 ? content.map((item, index) => (
                        <Accordion key={item.content_id} disableGutters elevation={0} sx={{ 
                            border: "1px solid #E2E8F0", 
                            '&:not(:last-child)': { borderBottom: 0 },
                            '&:first-of-type': { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                            '&:last-of-type': { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }
                        }}>
                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: "#F8FAFC" }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography fontWeight="600" fontFamily="Inter" sx={{ fontSize: "0.95rem", color: "#1E293B" }}>{item.title}</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: "#fff" }}>
                                <Stack spacing={1.5}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <PlayCircleOutline fontSize="small" sx={{ color: "#64748B" }} />
                                            <Typography variant="body2" fontFamily="Inter" color="#334155">Introduction to {item.title}</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontFamily="Inter">05:30</Typography>
                                    </Box>
                                     <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <PlayCircleOutline fontSize="small" sx={{ color: "#64748B" }} />
                                            <Typography variant="body2" fontFamily="Inter" color="#334155">Deep Dive into Concepts</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontFamily="Inter">10:15</Typography>
                                    </Box>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    )) : (
                        <Typography variant="body2" color="text.secondary" fontFamily="Inter">No content previews available.</Typography>
                    )}
                </Box>

                 {/* Description */}
                 <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" fontWeight="700" fontFamily="Inter" gutterBottom sx={{ mb: 2 }}>Description</Typography>
                    <Typography variant="body1" sx={{ 
                        whiteSpace: "pre-line", 
                        color: "#334155", 
                        lineHeight: 1.8, 
                        fontFamily: "Inter" 
                    }}>
                        {courseDetails.description || "No description available for this course."}
                    </Typography>
                </Box>

                 {/* Instructor */}
                 <Box sx={{ mb: 6, p: 4, bgcolor: "#fff", borderRadius: 3, border: "1px solid #E2E8F0" }}>
                    <Typography variant="h5" fontWeight="700" fontFamily="Inter" gutterBottom>Instructor</Typography>
                    <Link to="#" style={{ textDecoration: 'none', color: '#0056d2' }}>
                        <Typography variant="h6" color="#A435F0" fontWeight="700" fontFamily="Inter" sx={{ textDecoration: 'underline' }}>{courseDetails.instructor_name}</Typography>
                    </Link>
                    <Typography variant="body2" color="#64748B" fontFamily="Inter" sx={{ mb: 3 }}>Senior Developer & Instructor</Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start">
                        <Avatar sx={{ width: 100, height: 100 }} src="https://i.pravatar.cc/150?img=12" />
                        <Stack spacing={1}>
                             <Box display="flex" gap={1.5} alignItems="center">
                                <Grade fontSize="small" sx={{ color: "#FACC15" }}/>
                                <Typography variant="body2" fontFamily="Inter" fontWeight="500">4.7 Instructor Rating</Typography>
                             </Box>
                             <Box display="flex" gap={1.5} alignItems="center">
                                <EmojiEvents fontSize="small" sx={{ color: "#FACC15" }}/>
                                <Typography variant="body2" fontFamily="Inter" fontWeight="500">10,000+ Reviews</Typography>
                             </Box>
                             <Box display="flex" gap={1.5} alignItems="center">
                                <PlayCircleOutline fontSize="small" sx={{ color: "#64748B" }}/>
                                <Typography variant="body2" fontFamily="Inter" fontWeight="500">5 Courses</Typography>
                             </Box>
                             <Typography variant="body2" fontFamily="Inter" color="#475569" sx={{ mt: 1 }}>
                                 Experienced developer with a passion for teaching. I specialize in web development and have helped thousands of students launch their careers.
                             </Typography>
                        </Stack>
                    </Stack>
                </Box>
                
                {/* Reviews Component */}
                <Divider sx={{ my: 6, borderColor: "#E2E8F0" }} />
                <Typography variant="h5" fontWeight="700" fontFamily="Inter" gutterBottom sx={{ mb: 3 }}>Student Feedback</Typography>
                <Reviews />
            </Grid>

            {/* Right Column (Sticky Sidebar) */}
            <Grid item xs={12} md={4}>
                <Box sx={{ position: { md: "sticky" }, top: 100, zIndex: 10, mt: { xs: 0, md: -30 } }}>
                    <Card sx={{ 
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", 
                        border: "1px solid #E2E8F0",
                        overflow: 'hidden',
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)"
                    }}>
                        <CardMedia
                            component="img"
                            height="220"
                            image={courseDetails.image_url || "https://source.unsplash.com/random?coding"}
                            alt={courseDetails.title}
                            sx={{ p: 1, borderRadius: 3 }}
                        />
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h3" fontWeight="800" fontFamily="Inter" sx={{ mb: 2, color: "#0F172A" }}>
                                ₹{courseDetails.discount_price || 499}
                            </Typography>
                            
                            {enrolled ? (
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    size="large"
                                    onClick={handleOpenCourseContentPage}
                                    sx={{ 
                                        bgcolor: "#0F172A", 
                                        color: "#fff", 
                                        fontWeight: "600",
                                        fontFamily: "Inter",
                                        py: 1.8,
                                        mb: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        '&:hover': { bgcolor: "#1E293B" }
                                    }}
                                >
                                    Go to Course
                                </Button>
                            ) : (
                                <Stack spacing={1.5} sx={{ mb: 3 }}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        size="large"
                                        onClick={AddToCart}
                                        sx={{ 
                                            bgcolor: "#A435F0", 
                                            color: "#fff", 
                                            fontWeight: "600", 
                                            fontFamily: "Inter",
                                            py: 1.8,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            boxShadow: '0 4px 6px -1px rgba(164, 53, 240, 0.3)',
                                            '&:hover': { bgcolor: "#8710D8" }
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        size="large"
                                        onClick={AddToWishlist}
                                        startIcon={isInWishlist ? <Favorite /> : <FavoriteBorder />}
                                        sx={{ 
                                            borderColor: "#CBD5E1", 
                                            color: "#334155", 
                                            fontWeight: "600", 
                                            fontFamily: "Inter",
                                            py: 1.8,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            borderWidth: 2,
                                            '&:hover': { bgcolor: "#F8FAFC", borderColor: "#94A3B8", borderWidth: 2 }
                                        }}
                                    >
                                        {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        size="large"
                                        sx={{ 
                                            borderColor: "#0F172A", 
                                            color: "#0F172A", 
                                            fontWeight: "600", 
                                            fontFamily: "Inter",
                                            py: 1.8,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            borderWidth: 2,
                                            '&:hover': { bgcolor: "#F1F5F9", borderWidth: 2 }
                                        }}
                                    >
                                        Buy Now
                                    </Button>
                                </Stack>
                            )}
                            
                            <Box sx={{textAlign: 'center', mb: 2}}>
                                <Typography variant="caption" sx={{ color: "#64748B", fontFamily: "Inter" }}>
                                    30-Day Money-Back Guarantee
                                </Typography> 
                            </Box>

                            <Typography variant="subtitle2" fontWeight="700" fontFamily="Inter" gutterBottom sx={{ mt: 2 }}>This course includes:</Typography>
                            <Stack spacing={1.5} sx={{ mt: 1 }}>
                                <Box display="flex" gap={1.5} alignItems="center">
                                    <PlayCircleOutline fontSize="small" sx={{ color: "#475569" }} />
                                    <Typography variant="body2" fontFamily="Inter" color="#475569">12.5 hours on-demand video</Typography>
                                </Box>
                                <Box display="flex" gap={1.5} alignItems="center">
                                    <AllInclusive fontSize="small" sx={{ color: "#475569" }} />
                                    <Typography variant="body2" fontFamily="Inter" color="#475569">Full lifetime access</Typography>
                                </Box>
                                <Box display="flex" gap={1.5} alignItems="center">
                                    <EmojiEvents fontSize="small" sx={{ color: "#475569" }} />
                                    <Typography variant="body2" fontFamily="Inter" color="#475569">Certificate of completion</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default CourseContent;
