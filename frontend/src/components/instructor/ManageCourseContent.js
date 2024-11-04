import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams, useLocation } from "react-router-dom";
// import Navbar from "../Home/NavBar";
import CatergoryMenu from "./CategoryMenu";

const ManageCourseContent = () => {
  const { courseId } = useParams(); // Get courseId from URL params
  const [courseContent, setCourseContent] = useState([]);
  const location = useLocation(); // Access the location object
const [courseName, setCourseName] = useState(location.state?.courseName || ""); // State for course name
  const [newContent, setNewContent] = useState({
    title: "",
    content_type: "",
    content_url: "",
    content_text: "",
    duration: "",
    content_order: 0, // Start with 0, will be updated later
  });
  const [editingContent, setEditingContent] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // For handling upload state

  useEffect(() => {
    fetchCourseContent();
    if (!courseName) {
      fetchCourseDetails(); // Fetch course details if courseName wasn't passed
    }
  }, [courseId, courseName]);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const fetchCourseContent = async () => {
    try {
      const response = await axiosInstance.get(`/api/content/${courseId}`);
      const contentData = response.data;
      setCourseContent(contentData);

      // Automatically set content order for new content
      if (contentData.length > 0) {
        const maxOrder = Math.max(
          ...contentData.map((item) => item.content_order)
        );
        setNewContent((prev) => ({ ...prev, content_order: maxOrder + 1 }));
      } else {
        setNewContent((prev) => ({ ...prev, content_order: 1 })); // Start at 1 if no content exists
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/courses/${courseId}`); // Adjust this endpoint as necessary
      console.log("Course details:", response.data);
      setCourseName(response.data.name);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
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
      setNewContent((prev) => ({
        ...prev,
        content_url: response.data.videoUrl,
      })); // Update content_url directly here
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading video:", error);
      setIsUploading(false);
    }
  };

  const createContent = async (e) => {
    e.preventDefault();

    if (!newContent.content_url) {
      alert("Please upload the video first.");
      return;
    }

    const contentData = { ...newContent, course_id: courseId };

    try {
      await axiosInstance.post("/api/content", contentData);
      fetchCourseContent();
      resetForm();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const updateContent = async (e) => {
    e.preventDefault();

    // Ensure a new video URL is provided for update
    if (!newContent.content_url) {
      alert("Please upload a new video for the update.");
      return;
    }

    const updatedContentData = {
      ...newContent,
      // No need for content_url fallback; it must be provided
    };

    try {
      await axiosInstance.put(
        `/api/content/${editingContent.content_id}`,
        updatedContentData
      );
      fetchCourseContent();
      resetForm();
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const deleteContent = async (contentId) => {
    try {
      await axiosInstance.delete(`/api/content/${contentId}`);
      fetchCourseContent();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const editContent = (content) => {
    setEditingContent(content);
    setNewContent(content);
  };

  const resetForm = () => {
    setEditingContent(null);
    setNewContent({
      title: "",
      content_type: "",
      content_url: "",
      content_text: "",
      duration: "",
      content_order: 0,
    });
    setVideoFile(null); // Reset video file
  };

  return (
    <>
      <CatergoryMenu />
      <div>
        <h1>Manage Course Content for: {courseName}</h1> {/* Display course name */}
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
            <input type="file" onChange={handleFileChange} accept="video/*" />
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
            readOnly // Make it read-only since it's auto-incremented
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
