import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosconfig";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Home/NavBar";
import "./dashboard.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Footer from "../Home/Footer.js";

const ManageCourseContent = () => {
  const { courseId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const location = useLocation();
  const [courseName, setCourseName] = useState(
    location.state?.courseName || ""
  );
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
  }, [courseId, courseName]);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const fetchCourseContent = async () => {
    try {
      const response = await axiosInstance.get(`/api/content/${courseId}`);
      const contentData = response.data;
      setCourseContent(contentData);

      if (contentData.length > 0) {
        const maxOrder = Math.max(
          ...contentData.map((item) => item.content_order)
        );
        setNewContent((prev) => ({ ...prev, content_order: maxOrder + 1 }));
      } else {
        setNewContent((prev) => ({ ...prev, content_order: 1 }));
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/courses/${courseId}`);
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
      setNewContent((prev) => ({
        ...prev,
        content_url: response.data.videoUrl,
      }));
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
    if (!newContent.content_url) {
      alert("Please upload a new video for the update.");
      return;
    }

    const updatedContentData = {
      ...newContent,
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
    setVideoFile(null);
  };

  return (
    <>
      <Navbar />
      <div className="manage-course-content">
        <h1 className="title">
          Manage Course Content for:
          <br /> <h6>{courseName}</h6>
        </h1>
        <div>
          <section className="content-list first-section">
            <h2>Content List</h2>
            <ul>
              {courseContent.length === 0 ? (
                <p style={{textAlign:"center"}}>
                  No course content found for this course.
                </p>
              ) : (
                <>
                  {courseContent.map((content) => (
                    <li
                      key={content.content_id}
                      className="instructor-content-item"
                    >
                      <h3>{content.title}</h3>
                      <div>
                        <button
                          onClick={() => editContent(content)}
                          className="instructor-edit-btn"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteContent(content.content_id)}
                          className="instructor-delete-btn"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </section>

          <section className="form-section instructor-course-edit">
            <h2>{editingContent ? "Edit Content" : "Add New Content"}</h2>
            <form
              onSubmit={editingContent ? updateContent : createContent}
              className="content-form"
            >
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
                readOnly
              />

              <div className="file-upload image-upload-courses-instructor">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="video/*"
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="instructor-course-upload-btn"
                >
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
                readOnly
              />
              <button
                type="submit"
                className="submit-btn"
                disabled={isUploading}
              >
                {editingContent ? "Update Content" : "Add Content"}
              </button>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageCourseContent;
