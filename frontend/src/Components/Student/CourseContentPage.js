import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import "./CourseContentPage.css";
import { useAuth } from "../../Context/auth.js";
import Navbar from "../Home/NavBar.js";
import noContent from "./no-content.png";
import jsPDF from 'jspdf'
import img from './Certificate1.png';

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
  const playerRef = useRef(null);
  const location = useLocation();
  const { courseName, instructorName } = location.state || {};

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const token = auth?.token;
        const response = await axios.get(
          `http://localhost:8080/api/content/enrolled/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
        const token = auth.token;
        const response = await axios.get(
          `http://localhost:8080/api/video/track/${auth.user.user_id}/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          const contentIds = new Set(
            response.data.map((item) => item.content_id)
          );
          console.log("Watched Content IDs:", contentIds);
          setWatchedContentIds(contentIds);
        }
      } catch (err) {
        console.error("Error fetching watched videos:", err);
        setError("Error fetching watched videos");
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
        const response = await axios.post(
          "http://localhost:8080/api/check-completion",
          {
            userId: auth.user.user_id,
            courseId,
          }
        );
        console.log("Course completion response:", response.data);
        setIsCompleted(response.data.completed);
      } catch (error) {
        console.error("Error checking course completion:", error);
        setError("Error checking course completion");
      }
    };

    checkCompletion();
  }, [auth, courseId]);


  const name = auth?.user?.full_name; 
  const course = courseName;
  
  const generateCertificate = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
  
    // Add background image
    doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
  
    // Add recipient name
    doc.setFontSize(36);
    doc.setFont('helvetica'); 
    doc.text(name, 105, 160, { align: 'center' }); 

    doc.setFontSize(15);
    doc.text(instructorName, 122, 178.5);
  
    doc.setFontSize(20);
    doc.text(course, 105, 195, { align: 'center' });
  
    doc.save(`${name}-${course}.pdf`);
  };

  const handleProgress = ({ played }) => {
    if (played >= 0.5 && !isVideoWatched) {
      setIsVideoWatched(true);
      const contentItem = courseContent.find(
        (content) => content.content_url === selectedVideo
      );
      if (contentItem) markVideoAsWatched(contentItem.content_id);
    }
  };

  const markVideoAsWatched = async (contentId) => {
    try {
      const token = auth.token;
      await axios.post(
        "http://localhost:8080/api/video/track",
        {
          userId: auth.user.user_id,
          courseId,
          contentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Video marked as watched");
      setWatchedContentIds((prev) => new Set(prev).add(contentId));
    } catch (error) {
      console.error("Error marking video as watched:", error);
      setError("Error updating video watch status");
    }
  };

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (courseContent.length === 0)
    return (
      <>
        <Navbar />
        <div className="no-content-student">
          <div>
            <img src={noContent} alt="No content available" />
            <p>No content available for this course.</p>
          </div>
        </div>
      </>
    );

  return (
    <>
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
          {isCompleted && <button onClick={() => generateCertificate()} className="download-certificate">Get Certificate</button>}
          <ul>
            {courseContent.map((content) => (
              <li
                key={content.content_id}
                className={
                  content.content_url === selectedVideo ? "active selected-list-items" : "selected-list-items"
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
    </>
  );
};

export default CourseContentPage;
