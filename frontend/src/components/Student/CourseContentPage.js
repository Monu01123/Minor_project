import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CourseContentPage.css";
import { useAuth } from "../../Context/auth.js";
import Navbar from "../Home/NavBar.js";

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedContentIds, setWatchedContentIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [auth] = useAuth();
  const [isVideoWatched, setIsVideoWatched] = useState(false);

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
        const firstVideo = response.data[0]?.content_url;
        setSelectedVideo(firstVideo || null);
      } catch (err) {
        console.error("Error fetching course content:", err);
        setError("Error fetching course content");
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchedVideos = async () => {
      try {
        if (!auth?.user?.user_id) {
          console.warn("User ID not available, skipping fetchWatchedVideos.");
          return;
        }

        const token = auth.token;
        const response = await axios.get(
          `http://localhost:8080/api/video/track/${auth.user.user_id}/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if there are results and populate watchedContentIds
        if (response.data && response.data.length > 0) {
          const contentIds = new Set(
            response.data.map((item) => item.content_id)
          );
          console.log("Watched Content IDs:", contentIds);
          setWatchedContentIds(contentIds);
        } else {
          console.log("No watched videos found for this user and course.");
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
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
      setIsVideoWatched(false); // Reset watch status for new video
    }
  }, [selectedVideo]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const watchedPercentage = (video.currentTime / video.duration) * 100;
      if (watchedPercentage >= 50 && !isVideoWatched) {
        setIsVideoWatched(true);
        const contentItem = courseContent.find(
          (content) => content.content_url === selectedVideo
        );
        if (contentItem) {
          markVideoAsWatched(contentItem.content_id); // Pass content_id instead of URL
        }
      }
    }
  };

  const markVideoAsWatched = async (contentId) => {
    try {
      const token = auth.token;
      await axios.post(
        "http://localhost:8080/api/video/track",
        {
          userId: auth.user.user_id,
          courseId: courseId,
          contentId: contentId, // Send content_id instead of video URL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Video marked as watched");
    } catch (error) {
      console.error("Error marking video as watched:", error);
      setError("Error updating video watch status");
    }
  };

  // Conditional rendering based on loading state, error state, or empty courseContent
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (courseContent.length === 0)
    return (
      <>
        <Navbar />
        <p>No content available for this course.</p>;
      </>
    );

  return (
    <>
      <Navbar />
      <div className="course-content-page">
        <div className="content-list">
          <h3>Course Content</h3>
          <ul>
            {courseContent.map((content) => (
              <li
                key={content.content_id}
                className={
                  content.content_url === selectedVideo ? "active" : ""
                }
                onClick={() => {
                  if (content.content_url) {
                    setSelectedVideo(content.content_url);
                  } else {
                    alert("You need to enroll to access this content.");
                  }
                }}
                style={{
                  cursor: content.content_url ? "pointer" : "not-allowed",
                  opacity: content.content_url ? 1 : 0.5,
                  textDecoration: watchedContentIds.has(content.content_id)
                    ? "underline"
                    : "none",
                  textDecorationColor: watchedContentIds.has(content.content_id)
                    ? "red"
                    : "initial",
                }}
              >
                {content.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="video-player">
          {selectedVideo ? (
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              controls
              onTimeUpdate={handleTimeUpdate} // Call handleTimeUpdate as the video plays
              onError={(e) => {
                console.error("Video loading error:", e.nativeEvent);
                setError("Error loading video");
              }}
            >
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.{" "}
              <a href={selectedVideo}>Download Video</a>
            </video>
          ) : (
            <p>No video selected</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseContentPage;
