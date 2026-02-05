import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig.js";
import { useAuth } from "../../Context/auth.js";
import Navbar from "../Home/NavBar.js";
import Footer from "../Home/Footer.js";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Fab,
  CircularProgress
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  RateReview,
  VideoLibrary,
  CloudUpload,
  School
} from "@mui/icons-material";

const InstructorDashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    discount_price: "",
    image_url: "",
    category_id: "",
    level: "",
    language: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const instructorId = auth?.user?.user_id;

  useEffect(() => {
    if (instructorId) {
      fetchCourses();
      fetchCategories();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, instructorId]);

  const fetchCourses = () => {
    setLoading(true);
    axiosInstance
      .get(`/api/courses/instructor/${instructorId}`)
      .then((response) => setCourses(response.data || []))
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    axiosInstance
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setNewCourse(course);
    } else {
      setEditingCourse(null);
      setNewCourse({
        title: "",
        description: "",
        price: "",
        discount_price: "",
        image_url: "",
        category_id: "",
        level: "",
        language: "",
      });
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axiosInstance.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedImageUrl = response.data.imageUrl;
      setNewCourse((prev) => ({ ...prev, image_url: uploadedImageUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse();
    } else {
      createCourse();
    }
  };

  const createCourse = () => {
    axiosInstance
      .post("/api/courses", { ...newCourse, instructor_id: instructorId })
      .then((response) => {
        if (response.data && response.data.course_id) {
          fetchCourses();
        }
        handleCloseDialog();
      })
      .catch((error) => console.error("Error creating course:", error));
  };

  const updateCourse = () => {
    axiosInstance
      .put(`/api/courses/${editingCourse.course_id}`, newCourse)
      .then(() => {
        fetchCourses();
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating course:", error));
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axiosInstance.delete(`/api/courses/${courseId}`, {
        data: { instructor_id: instructorId },
      });
      setCourses(courses.filter((course) => course.course_id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  if (loading) return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
      </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Navbar />
      
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
        py: 6, 
        color: 'white',
        mb: 4 
      }}>
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h3" fontWeight="800" fontFamily="Inter" gutterBottom>
                        Instructor Dashboard
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.8, fontFamily: "Inter" }}>
                        Manage your courses, content, and student reviews.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ 
                        bgcolor: '#A435F0', 
                        fontFamily: "Inter", 
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        '&:hover': { bgcolor: '#8710D8' }
                    }}
                >
                    Create New Course
                </Button>
            </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ flexGrow: 1, mb: 8 }}>
          {courses.length === 0 ? (
             <Box sx={{ textAlign: 'center', py: 8 }}>
                 <Typography variant="h5" color="text.secondary">No courses found. Create your first course!</Typography>
             </Box>
          ) : (
            <Grid container spacing={4}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.course_id}>
                   <Card sx={{ 
                       height: '100%', 
                       display: 'flex', 
                       flexDirection: 'column',
                       borderRadius: 3,
                       boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                       transition: 'transform 0.2s',
                       '&:hover': { transform: 'translateY(-5px)' }
                   }}>
                      <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="180"
                            image={course.image_url || "https://source.unsplash.com/random?coding"}
                            alt={course.title}
                          />
                          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                              <Chip label={course.level} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', fontWeight: 'bold' }} />
                          </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold" fontFamily="Inter" gutterBottom noWrap>
                              {course.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontFamily="Inter" sx={{ mb: 1 }}>
                              Price: {course.discount_price ? (
                                  <>
                                    <span style={{ textDecoration: 'line-through', marginRight: 8 }}>₹{course.price}</span>
                                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>₹{course.discount_price}</span>
                                  </>
                              ) : `₹${course.price}`}
                          </Typography>
                          <Box display="flex" gap={1} mb={2}>
                              <Chip label={course.language} size="small" variant="outlined" />
                              <Chip label={`${course.average_rating || 0} ★`} size="small" color="warning" variant="outlined" />
                          </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
                          <Box>
                              <Tooltip title="Manage Content">
                                  <IconButton onClick={() => navigate(`/instructor/course/${course.course_id}/content`, { state: { courseName: course.title } })}>
                                      <VideoLibrary color="primary" />
                                  </IconButton>
                              </Tooltip>
                              <Tooltip title="Reviews">
                                  <IconButton onClick={() => navigate(`/instructor/${instructorId}/course/${course.course_id}/reviews`, { state: { courseTitle: course.title } })}>
                                      <RateReview color="action" />
                                  </IconButton>
                              </Tooltip>
                          </Box>
                          <Box>
                              <Tooltip title="Edit Course">
                                  <IconButton onClick={() => handleOpenDialog(course)}>
                                      <Edit />
                                  </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Course">
                                  <IconButton onClick={() => deleteCourse(course.course_id)} color="error">
                                      <Delete />
                                  </IconButton>
                              </Tooltip>
                          </Box>
                      </CardActions>
                   </Card>
                </Grid>
              ))}
            </Grid>
          )}
      </Container>
      <Footer />

      {/* Create/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontFamily: 'Inter', fontWeight: 700 }}>
              {editingCourse ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogContent dividers>
              <Box component="form" sx={{ mt: 1 }}>
                  <Grid container spacing={3}>
                      <Grid item xs={12}>
                          <TextField
                              name="title"
                              label="Course Title"
                              fullWidth
                              required
                              value={newCourse.title}
                              onChange={handleChange}
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              name="description"
                              label="Description"
                              fullWidth
                              multiline
                              rows={4}
                              required
                              value={newCourse.description}
                              onChange={handleChange}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              name="price"
                              label="Price (₹)"
                              type="number"
                              fullWidth
                              required
                              value={newCourse.price}
                              onChange={handleChange}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              name="discount_price"
                              label="Discount Price (₹)"
                              type="number"
                              fullWidth
                              value={newCourse.discount_price}
                              onChange={handleChange}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              select
                              name="category_id"
                              label="Category"
                              fullWidth
                              required
                              value={newCourse.category_id}
                              onChange={handleChange}
                          >
                              {categories.map((cat) => (
                                  <MenuItem key={cat.category_id} value={cat.category_id}>
                                      {cat.name}
                                  </MenuItem>
                              ))}
                          </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              select
                              name="level"
                              label="Level"
                              fullWidth
                              required
                              value={newCourse.level}
                              onChange={handleChange}
                          >
                            <MenuItem value="beginner">Beginner</MenuItem>
                            <MenuItem value="intermediate">Intermediate</MenuItem>
                            <MenuItem value="advanced">Advanced</MenuItem>
                          </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              select
                              name="language"
                              label="Language"
                              fullWidth
                              required
                              value={newCourse.language}
                              onChange={handleChange}
                          >
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Hindi">Hindi</MenuItem>
                            <MenuItem value="Spanish">Spanish</MenuItem>
                          </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center" gap={2}>
                              <Button
                                  variant="outlined"
                                  component="label"
                                  startIcon={<CloudUpload />}
                              >
                                  Upload Information Image
                                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                              </Button>
                              <Button 
                                  onClick={handleUpload} 
                                  disabled={!imageFile || uploadingImage} 
                                  variant="contained" 
                                  size="small"
                              >
                                  {uploadingImage ? "Uploading..." : "Upload"}
                              </Button>
                          </Box>
                          {newCourse.image_url && (
                              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'green' }}>
                                  Image uploaded successfully
                              </Typography>
                          )}
                      </Grid>
                  </Grid>
              </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#A435F0', '&:hover': { bgcolor: '#8710D8' } }}>
                  {editingCourse ? "Update Course" : "Create Course"}
              </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorDashboard;
