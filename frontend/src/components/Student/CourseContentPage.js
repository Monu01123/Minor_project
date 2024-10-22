import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CourseContentPage.css';
import { useAuth } from '../../Context/auth.js';

const CourseContentPage = () => {
    const { courseId } = useParams();
    const [courseContent, setCourseContent] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const [auth] = useAuth();

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                const token = auth?.token;

                const response = await axios.get(`http://localhost:8080/api/content/enrolled/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Check the response
                console.log("Course Content Response:", response.data);
                
                setCourseContent(response.data);
                
                // Set the first video URL if available
                const firstVideo = response.data[0]?.content_url;
                setSelectedVideo(firstVideo || null); 
            } catch (err) {
                console.error("Error fetching course content:", err);
                setError('Error fetching course content');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourseContent();
    }, [courseId, auth]);

    // Pause and reload the video whenever selectedVideo changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.load();
        }
    }, [selectedVideo]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="course-content-page">
            <div className="content-list">
                <h3>Course Content</h3>
                <ul>
                    {courseContent.map(content => (
                        <li
                            key={content.content_id}
                            className={content.content_url === selectedVideo ? 'active' : ''}
                            onClick={() => {
                                if (content.content_url) {
                                    setSelectedVideo(content.content_url); // Update the selected video
                                } else {
                                    alert('You need to enroll to access this content.');
                                }
                            }}
                            style={{ cursor: content.content_url ? 'pointer' : 'not-allowed', opacity: content.content_url ? 1 : 0.5 }}
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
                        onError={(e) => {
                            console.error("Video loading error:", e.nativeEvent);
                            setError('Error loading video');
                        }}
                    >
                        <source src={selectedVideo} type="video/mp4" />
                        Your browser does not support the video tag. <a href={selectedVideo}>Download Video</a>
                    </video>
                ) : (
                    <p>No video selected</p>
                )}
            </div>
        </div>
    );
};

export default CourseContentPage;
