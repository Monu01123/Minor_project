import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Home/NavBar";
import Footer from "../Home/Footer.js";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
  Chip,
  Stack
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  VideoLibrary,
  CloudUpload,
  AccessTime,
  FormatListNumbered
} from "@mui/icons-material";

const ManageCourseContent = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const [courseContent, setCourseContent] = useState([]);
  const [courseName, setCourseName] = useState(
    location.state?.courseName || ""
  );
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    content_type: "video",
    content_url: "",
    content_text: "",
    duration: "",
    content_order: 0,
  });
  const [editingContent, setEditingContent] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCourseContent();
    if (!courseName) {
      fetchCourseDetails();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, courseName]);

  const fetchCourseContent = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/content/${courseId}`);
      const contentData = response.data;
      setCourseContent(contentData);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
        setLoading(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/courses/${courseId}`);
      setCourseName(response.data.title);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const handleOpenDialog = (content = null) => {
      if (content) {
          setEditingContent(content);
          setNewContent(content);
      } else {
          setEditingContent(null);
          // Calculate next order
          const maxOrder = courseContent.length > 0 
            ? Math.max(...courseContent.map((item) => item.content_order || 0)) 
            : 0;
            
          setNewContent({
            title: "",
            content_type: "video",
            content_url: "",
            content_text: "",
            duration: "",
            content_order: maxOrder + 1,
          });
      }
      setVideoFile(null);
      setOpenDialog(true);
  };

  const handleCloseDialog = () => {
      setOpenDialog(false);
      setEditingContent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent({ ...newContent, [name]: value });
  };

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle Immediate Success or Background Processing
      if (response.data.videoUrl) {
          setNewContent((prev) => ({
            ...prev,
            content_url: response.data.videoUrl,
          }));
      } else if (response.data.status === 'processing') {
          // Set a placeholder URL so validation passes
          setNewContent((prev) => ({
            ...prev,
            content_url: `PROCESSING_VIDEO_TEMP_ID_${response.data.tempId}`,
          }));
          alert("Video upload started in background. You can save this content now.");
      }

    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContent) {
        updateContent();
    } else {
        createContent();
    }
  };

  const createContent = async () => {
    if (!newContent.content_url && newContent.content_type === 'video') {
      alert("Please upload the video first.");
      return;
    }

    const contentData = { ...newContent, course_id: courseId };

    try {
      await axiosInstance.post("/api/content", contentData);
      fetchCourseContent();
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const updateContent = async () => {
    try {
      await axiosInstance.put(
        `/api/content/${editingContent.content_id}`,
        newContent
      );
      fetchCourseContent();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const deleteContent = async (contentId) => {
    if(!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await axiosInstance.delete(`/api/content/${contentId}`);
      setCourseContent(courseContent.filter(c => c.content_id !== contentId));
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Navbar />
      
      <Box sx={{ background: '#0F172A', py: 4, color: 'white' }}>
          <Container maxWidth="lg">
              <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 1 }}>Course Content Management</Typography>
              <Typography variant="h4" fontWeight="bold" fontFamily="Inter">{courseName}</Typography>
          </Container>
      </Box>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold" fontFamily="Inter">
                      Course Curriculum ({courseContent.length} items)
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#0F172A', fontFamily: 'Inter', textTransform: 'none' }}
                >
                    Add Content
                </Button>
              </Box>

              {loading ? (
                  <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
              ) : courseContent.length === 0 ? (
                  <Box textAlign="center" py={6} bgcolor="#F8FAFC" borderRadius={2}>
                      <VideoLibrary sx={{ fontSize: 48, color: '#CBD5E1', mb: 1 }} />
                      <Typography color="text.secondary">No content added yet.</Typography>
                  </Box>
              ) : (
                  <List>
                      {courseContent.map((content, index) => (
                          <React.Fragment key={content.content_id}>
                              {index > 0 && <Divider component="li" />}
                              <ListItem 
                                sx={{ 
                                    py: 2, 
                                    '&:hover': { bgcolor: '#F8FAFC' },
                                    borderRadius: 1
                                }}
                              >
                                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: '#64748B' }}>
                                      <Chip label={content.content_order} size="small" variant="outlined" />
                                  </Box>
                                  <ListItemText 
                                    primary={
                                        <Typography fontWeight="500" fontFamily="Inter">
                                            {content.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <VideoLibrary fontSize="small" sx={{ fontSize: 16 }} />
                                                <Typography variant="caption">{content.content_type}</Typography>
                                            </Box>
                                            {content.duration && (
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <AccessTime fontSize="small" sx={{ fontSize: 16 }} />
                                                    <Typography variant="caption">{content.duration} min</Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                      <IconButton edge="end" onClick={() => handleOpenDialog(content)} sx={{ mr: 1 }}>
                                          <Edit />
                                      </IconButton>
                                      <IconButton edge="end" onClick={() => deleteContent(content.content_id)} color="error">
                                          <Delete />
                                      </IconButton>
                                  </ListItemSecondaryAction>
                              </ListItem>
                          </React.Fragment>
                      ))}
                  </List>
              )}
          </Paper>
      </Container>
      <Footer />

      {/* Add/Edit Content Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontFamily: 'Inter', fontWeight: 700 }}>
              {editingContent ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <DialogContent dividers>
              <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                      name="title"
                      label="Title"
                      fullWidth
                      required
                      value={newContent.title}
                      onChange={handleInputChange}
                  />
                  <TextField
                      name="content_type"
                      label="Content Type"
                      fullWidth
                      value={newContent.content_type}
                      InputProps={{ readOnly: true }}
                      variant="filled"
                  />
                  
                  <Box sx={{ border: '1px dashed #CBD5E1', p: 2, borderRadius: 2, bgcolor: '#F8FAFC' }}>
                      <Typography variant="subtitle2" gutterBottom>Video Upload</Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                          <Button
                              variant="outlined"
                              component="label"
                              startIcon={<CloudUpload />}
                              size="small"
                          >
                              Select Video
                              <input type="file" hidden accept="video/*" onChange={handleFileChange} />
                          </Button>
                          <Button 
                              onClick={handleUpload} 
                              disabled={!videoFile || isUploading} 
                              variant="contained" 
                              size="small"
                              sx={{ bgcolor: '#0F172A' }}
                          >
                              {isUploading ? "Uploading..." : "Upload"}
                          </Button>
                      </Box>
                      {newContent.content_url && (
                           <Typography variant="caption" sx={{ color: 'green', display: 'block', mt: 1 }}>
                               {newContent.content_url.startsWith('PROCESSING') 
                                ? "Video is processing in background. Ready to save." 
                                : "Video URL set successfully"}
                           </Typography>
                      )}
                  </Box>

                  <TextField
                      name="content_text"
                      label="Content Description / Text"
                      fullWidth
                      multiline
                      rows={3}
                      value={newContent.content_text}
                      onChange={handleInputChange}
                  />
                  
                  <Stack direction="row" spacing={2}>
                      <TextField
                          name="duration"
                          label="Duration (minutes)"
                          type="number"
                          fullWidth
                          value={newContent.duration}
                          onChange={handleInputChange}
                      />
                      <TextField
                          name="content_order"
                          label="Order Sequence"
                          type="number"
                          fullWidth
                          value={newContent.content_order}
                          InputProps={{ readOnly: true }}
                      />
                  </Stack>
              </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
              <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                variant="contained" 
                disabled={isUploading}
                sx={{ bgcolor: '#A435F0', '&:hover': { bgcolor: '#8710D8' } }}
              >
                  {editingContent ? "Update Content" : "Add Content"}
              </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCourseContent;
