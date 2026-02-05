import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { useAuth } from "../../Context/auth.js";
import Navbar from "../Home/NavBar.js";
import noContent from "./no-content.png";
import jsPDF from 'jspdf'
import img from './Certificate1.png';
import axiosInstance from "../../axiosconfig.js";
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider, 
    Button, 
    Drawer, 
    useMediaQuery, 
    useTheme,
    IconButton,
    Container,
    Paper,
    LinearProgress
} from "@mui/material";
import { 
    PlayCircleOutline, 
    CheckCircle, 
    RadioButtonUnchecked, 
    Menu as MenuIcon,
    Download,
    EmojiEvents
} from "@mui/icons-material";

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedContentIds, setWatchedContentIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [auth] = useAuth();
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const playerRef = useRef(null);
  const location = useLocation();
  const courseName = location.state?.courseName;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await axiosInstance.get(`/api/content/enrolled/${courseId}`);
        console.log("Course Content Response:", response.data);
        setCourseContent(response.data);
        setSelectedVideo(response.data[0]?.content_url || null);
      } catch (err) {
        console.error("Error fetching course content:", err);
        setError("Error fetching course content");
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchedVideos = async () => {
      if (!auth?.user?.user_id) return;

      try {
        const response = await axiosInstance.get(`/api/video/track/${auth.user.user_id}/${courseId}`);

        if (response.data) {
          const contentIds = new Set(
            response.data.map((item) => item.content_id)
          );
          console.log("Watched Content IDs:", contentIds);
          setWatchedContentIds(contentIds);
        }
      } catch (err) {
        console.error("Error fetching watched videos:", err);
        // Don't block loading if this fails
      }
    };

    if (auth?.user) {
      fetchWatchedVideos();
      fetchCourseContent();
    }
  }, [courseId, auth]);

  useEffect(() => {
    const checkCompletion = async () => {
      if (!auth?.user?.user_id) return;

      try {
        const response = await axiosInstance.post("/api/check-completion", {
            userId: auth.user.user_id,
            courseId,
        });
        console.log("Course completion response:", response.data);
        setIsCompleted(response.data.completed);
      } catch (error) {
        console.error("Error checking course completion:", error);
      }
    };

    checkCompletion();
  }, [auth, courseId, watchedContentIds]); 

  const name = auth?.user?.full_name; 
  const course = courseName || "Course Completion"; 
  
  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
  
    doc.setFontSize(36);
    doc.setFont('helvetica'); 
    doc.text(name || "Student Name", 105, 160, { align: 'center' }); 

    doc.setFontSize(15);
    doc.text("instructor", 122, 178.5);
  
    doc.setFontSize(20);
    doc.text(course, 105, 195, { align: 'center' });
  
    doc.save(`${name || "Certificate"}-${course}.pdf`);
  };

  const handleProgress = ({ played }) => {
    if (played >= 0.9 && !isVideoWatched) { // Changed to 90% for realism
      const contentItem = courseContent.find(
        (content) => content.content_url === selectedVideo
      );
      if (contentItem && !watchedContentIds.has(contentItem.content_id)) {
          markVideoAsWatched(contentItem.content_id);
          setIsVideoWatched(true);
      }
    }
  };

  const handleVideoChange = (url) => {
      setSelectedVideo(url);
      setIsVideoWatched(false); // Reset watch status for new video
  };

  const markVideoAsWatched = async (contentId) => {
    try {
      await axiosInstance.post("/api/video/track", {
          userId: auth.user.user_id,
          courseId,
          contentId,
      });
      console.log("Video marked as watched");
      setWatchedContentIds((prev) => new Set(prev).add(contentId));
    } catch (error) {
      console.error("Error marking video as watched:", error);
    }
  };

  if (loading) return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#1c1d1f", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <LinearProgress sx={{ width: "50%" }} />
      </Box>
  );

  if (error || courseContent.length === 0)
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
        <Navbar />
        <Container sx={{ py: 10, textAlign: "center" }}>
             <img src={noContent} alt="No content available" style={{ maxWidth: "300px", marginBottom: "20px" }} />
             <Typography variant="h5" color="text.secondary">No content available for this course.</Typography>
        </Container>
      </Box>
    );

  const drawerWidth = 350;

  const drawerContent = (
      <Box sx={{ bgcolor: "#111827", height: "100%", color: "#fff", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #374151" }}>
              <Typography variant="subtitle1" fontWeight="bold" fontFamily="Inter" noWrap title={courseName}>
                  {courseName || "Course Content"}
              </Typography>
              <Typography variant="caption" color="#9CA3AF" fontFamily="Inter">
                  {watchedContentIds.size} / {courseContent.length} completed
              </Typography>
               <LinearProgress 
                  variant="determinate" 
                  value={(watchedContentIds.size / courseContent.length) * 100} 
                  sx={{ mt: 1, bgcolor: "#374151", '& .MuiLinearProgress-bar': { bgcolor: "#10B981" } }}
                />
          </Box>
          
          <List sx={{ flexGrow: 1, overflowY: "auto", py: 0 }}>
              {courseContent.map((content, index) => {
                  const isActive = content.content_url === selectedVideo;
                  const isWatched = watchedContentIds.has(content.content_id);
                  
                  return (
                      <ListItem 
                        button 
                        key={content.content_id}
                        onClick={() => handleVideoChange(content.content_url)}
                        sx={{ 
                            borderLeft: isActive ? "4px solid #A435F0" : "4px solid transparent",
                            bgcolor: isActive ? "rgba(164, 53, 240, 0.1)" : "transparent",
                            '&:hover': { bgcolor: "rgba(255,255,255,0.05)" },
                            py: 1.5
                        }}
                      >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                              {isWatched ? (
                                  <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />
                              ) : isActive ? (
                                  <PlayCircleOutline sx={{ color: "#fff", fontSize: 20 }} />
                              ) : (
                                  <RadioButtonUnchecked sx={{ color: "#6B7280", fontSize: 20 }} />
                              )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                                <Typography variant="body2" fontFamily="Inter" sx={{ color: isActive ? "#fff" : "#D1D5DB", fontWeight: isActive ? 600 : 400 }}>
                                    {index + 1}. {content.title}
                                </Typography>
                            } 
                          />
                      </ListItem>
                  );
              })}
          </List>

          {isCompleted && (
              <Box sx={{ p: 2, borderTop: "1px solid #374151", bgcolor: "#1F2937" }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="success" 
                    startIcon={<EmojiEvents />}
                    onClick={generateCertificate}
                    sx={{ fontFamily: "Inter", fontWeight: "bold", textTransform: 'none' }}
                  >
                      Get Certificate
                  </Button>
              </Box>
          )}
      </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#000" }}>
      {/* Custom Minimal Navbar for Player Mode */}
      <Box sx={{ bgcolor: "#111827", borderBottom: "1px solid #374151", py: 1, px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
           <Box display="flex" alignItems="center" gap={2}>
               <a href="/" style={{ textDecoration: 'none' }}>
                   <Typography variant="h6" fontWeight="800" fontFamily="Inter" sx={{ color: "#fff", letterSpacing: -0.5 }}>
                       Skillora<span style={{color:"#A435F0"}}>.</span>
                   </Typography>
               </a>
               <Divider orientation="vertical" flexItem sx={{ bgcolor: "#374151", mx: 1 }} />
               <Typography variant="body2" color="#D1D5DB" fontFamily="Inter" sx={{ display: { xs: 'none', sm: 'block' } }}>
                   {courseName}
               </Typography>
           </Box>
           
           <Box display="flex" alignItems="center" gap={2}>
               {isMobile && (
                   <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: "#fff" }}>
                       <MenuIcon />
                   </IconButton>
               )}
               {!isMobile && (
                 <Button variant="outlined" size="small" sx={{ color: "#D1D5DB", borderColor: "#4B5563", textTransform: 'none' }} href="/student-dashboard">
                     Exit to Dashboard
                 </Button>
               )}
           </Box>
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* Main Video Area */}
          <Box sx={{ flexGrow: 1, bgcolor: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
               {selectedVideo ? (
                   selectedVideo.startsWith('PROCESSING') ? (
                       <Box textAlign="center" color="white">
                           <Typography variant="h6">Video is processing...</Typography>
                           <Typography variant="body2" color="gray">This usually takes a few minutes. Please refresh the page shortly.</Typography>
                       </Box>
                   ) : (
                    <ReactPlayer
                      ref={playerRef}
                      url={selectedVideo}
                      controls
                      width="100%"
                      height="100%"
                      onProgress={handleProgress}
                      config={{
                         file: { attributes: { controlsList: "nodownload" } }
                      }}
                      style={{ maxHeight: "calc(100vh - 64px)" }}
                    />
                   )
                ) : (
                   <Typography color="#6B7280">Select a video to start learning</Typography>
               )}
          </Box>

          {/* Sidebar - Desktop */}
          <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}>
               {drawerContent}
          </Box>

          {/* Sidebar - Mobile */}
          <Drawer
            anchor="right"
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: "#111827" },
            }}
          >
              {drawerContent}
          </Drawer>
      </Box>
    </Box>
  );
};

export default CourseContentPage;
