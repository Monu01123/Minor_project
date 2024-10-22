import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams } from "react-router-dom";
import Navbar from "../Home/NavBar";

const ManageCourseContent = () => {
  const { courseId } = useParams(); // Get courseId from URL params
  const [courseContent, setCourseContent] = useState([]);
  const [newContent, setNewContent] = useState({
    title: "",
    content_type: "",
    content_url: "",
    content_text: "",
    duration: "",
    content_order: "",
  });
  const [editingContent, setEditingContent] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // For handling upload state

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const fetchCourseContent = () => {
    axiosInstance
      .get(`/api/content/${courseId}`)
      .then((response) => setCourseContent(response.data))
      .catch((error) => console.error("Error fetching content:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent({ ...newContent, [name]: value });
  };

  const handleUpload = async () => {
    if (!videoFile) return; // Ensure a file is selected
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setVideoUrl(response.data.videoUrl); // Store the video URL from the response
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading video:", error);
      setIsUploading(false);
    }
  };

  const createContent = async (e) => {
    e.preventDefault();
    
    if (!videoUrl) {
      alert("Please upload the video first.");
      return;
    }

    // Add video URL to the new content before submission
    const contentData = { ...newContent, course_id: courseId, content_url: videoUrl };

    axiosInstance
      .post("/api/content", contentData)
      .then(() => {
        fetchCourseContent();
        setNewContent({
          title: "",
          content_type: "",
          content_url: "",
          content_text: "",
          duration: "",
          content_order: "",
        });
        setVideoUrl(null); // Reset after success
      })
      .catch((error) => console.error("Error creating content:", error));
  };

  const updateContent = async (e) => {
    e.preventDefault();
    
    if (!videoUrl && !editingContent.content_url) {
      alert("Please upload the video or retain the existing video.");
      return;
    }

    const updatedContentData = { ...newContent, content_url: videoUrl || editingContent.content_url };

    axiosInstance
      .put(`/api/content/${editingContent.content_id}`, updatedContentData)
      .then(() => {
        fetchCourseContent();
        setEditingContent(null);
        setNewContent({
          title: "",
          content_type: "",
          content_url: "",
          content_text: "",
          duration: "",
          content_order: "",
        });
        setVideoUrl(null); // Reset after success
      })
      .catch((error) => console.error("Error updating content:", error));
  };

  const deleteContent = (contentId) => {
    axiosInstance
      .delete(`/api/content/${contentId}`)
      .then(() => fetchCourseContent())
      .catch((error) => console.error("Error deleting content:", error));
  };

  const editContent = (content) => {
    setEditingContent(content);
    setNewContent(content);
    setVideoUrl(content.content_url); // Set existing video URL to retain the video when editing
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Manage Course Content</h1>
        <h2>Content List</h2>
        <ul>
          {courseContent.map((content) => (
            <li key={content.content_id}>
              <h3>{content.title}</h3>
              <button onClick={() => editContent(content)}>Edit</button>
              <button onClick={() => deleteContent(content.content_id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h2>{editingContent ? "Edit Content" : "Add New Content"}</h2>
        <form onSubmit={editingContent ? updateContent : createContent}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newContent.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="content_type"
            placeholder="Content Type"
            value={newContent.content_type}
            onChange={handleInputChange}
            required
          />
          <div>
            <input type="file" onChange={handleFileChange} accept="video/*" required />
            <button type="button" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>

          <textarea
            name="content_text"
            placeholder="Content Text"
            value={newContent.content_text}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration"
            value={newContent.duration}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="content_order"
            placeholder="Content Order"
            value={newContent.content_order}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={isUploading}>
            {editingContent ? "Update Content" : "Add Content"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ManageCourseContent;
