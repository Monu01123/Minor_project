import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { useAuth } from "../../Context/auth.js";
import Navbar from "../Home/NavBar.js";
import noContent from "./no-content.png";
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
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
=======
import jsPDF from "jspdf";
import img from "./Certificate1.png";
import { motion } from "framer-motion";
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js

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
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
  const courseName = location.state?.courseName;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
=======
  const { courseName, instructorName } = location.state || {};
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
        const response = await axiosInstance.get(`/api/content/enrolled/${courseId}`);
=======
        const token = auth?.token;
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/content/enrolled/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
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
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
        const response = await axiosInstance.get(`/api/video/track/${auth.user.user_id}/${courseId}`);
=======
        const token = auth.token;
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/video/track/${auth.user.user_id}/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js

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
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
        const response = await axiosInstance.post("/api/check-completion", {
=======
        const response = await axios.post(
          "https://minor-project-3-18lw.onrender.com/api/check-completion",
          {
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
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
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
  }, [auth, courseId, watchedContentIds]); 

  const name = auth?.user?.full_name; 
  const course = courseName || "Course Completion"; 
  
=======
  }, [auth, courseId]);

  const name = auth?.user?.full_name;
  const course = courseName;

>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
  const generateCertificate = () => {
    const doc = new jsPDF();
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
    doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
  
    doc.setFontSize(36);
    doc.setFont('helvetica'); 
    doc.text(name || "Student Name", 105, 160, { align: 'center' }); 
=======

    // Add background image
    doc.addImage(
      img,
      "PNG",
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );

    // Add recipient name
    doc.setFontSize(36);
    doc.setFont("helvetica");
    doc.text(name, 105, 160, { align: "center" });
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js

    doc.setFontSize(15);
    doc.text(instructorName, 122, 178.5);

    doc.setFontSize(20);
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
    doc.text(course, 105, 195, { align: 'center' });
  
    doc.save(`${name || "Certificate"}-${course}.pdf`);
=======
    doc.text(course, 105, 195, { align: "center" });

    doc.save(`${name}-${course}.pdf`);
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
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
<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
      await axiosInstance.post("/api/video/track", {
=======
      const token = auth.token;
      await axios.post(
        "https://minor-project-3-18lw.onrender.com/api/video/track",
        {
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
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

<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
  if (loading) return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#1c1d1f", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <LinearProgress sx={{ width: "50%" }} />
      </Box>
  );

  if (error || courseContent.length === 0)
=======
  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (courseContent.length === 0)
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
        <Navbar />
        <Container sx={{ py: 10, textAlign: "center" }}>
             <img src={noContent} alt="No content available" style={{ maxWidth: "300px", marginBottom: "20px" }} />
             <Typography variant="h5" color="text.secondary">No content available for this course.</Typography>
        </Container>
      </Box>
    );

<<<<<<< HEAD:frontend/src/components/Student/CourseContentPage.js
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
=======
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Navbar />
        <div className="course-content-page">
          <div className="video-player">
            {selectedVideo ? (
              <ReactPlayer
                ref={playerRef}
                url={selectedVideo}
                controls
                width="100%"
                height="auto"
                onProgress={handleProgress}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            ) : (
              <p>No video selected</p>
            )}
          </div>

          <div className="content-list">
            <h3>{courseName ? `${courseName}` : "Course Content"}</h3>
            {isCompleted && (
              <button
                onClick={() => generateCertificate()}
                className="download-certificate"
              >
                Get Certificate
              </button>
            )}
            <ul>
              {courseContent.map((content) => (
                <li
                  key={content.content_id}
                  className={
                    content.content_url === selectedVideo
                      ? "active selected-list-items"
                      : "selected-list-items"
                  }
                  onClick={() => {
                    if (content.content_url) {
                      setSelectedVideo(content.content_url);
                    } else {
                      alert("You need to enroll to access this content.");
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    borderBottom: watchedContentIds.has(content.content_id)
                      ? "4px solid red"
                      : "none",
                  }}
                >
                  {content.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Student/CourseContentPage.js
  );
};

export default CourseContentPage;
