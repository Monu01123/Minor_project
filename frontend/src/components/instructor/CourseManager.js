import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig.js";
import { useAuth } from "../../Context/auth.js";
import "./dashboard.css";
import GradeIcon from "@mui/icons-material/Grade";
import "../Home/HomePage.css";
import CategoryMenu from "./CategoryMenu.js";

const InstructorDashboard = () => {
  const [auth] = useAuth();
  const [courses, setCourses] = useState([]);
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
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([]); // To store categories

  const instructorId = auth?.user?.user_id;

  useEffect(() => {
    if (instructorId) {
      fetchCourses();
      fetchCategories(); // Fetch categories on load
    }
  }, [auth, instructorId]);

  const fetchCourses = () => {
    axiosInstance
      .get(`/api/courses/instructor/${instructorId}`)
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const fetchCategories = () => {
    axiosInstance
      .get("/categories") // Adjust endpoint as necessary
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const createCourse = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/api/courses", { ...newCourse, instructor_id: instructorId })
      .then((response) => {
        if (response.data && response.data.course_id) {
          setCourses((prevCourses) => [...prevCourses, response.data]);
        }
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
        fetchCourses();
      })
      .catch((error) => console.error("Error creating course:", error));
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setNewCourse(course);
  };

  const updateCourse = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/api/courses/${editingCourse.course_id}`, newCourse)
      .then((response) => {
        const updatedCourses = courses.map((c) =>
          c.course_id === editingCourse.course_id ? { ...c, ...newCourse } : c
        );
        setCourses(updatedCourses);
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
      })
      .catch((error) => console.error("Error updating course:", error));
  };

  const deleteCourse = async (courseId) => {
    try {
      await axiosInstance.delete(`/api/courses/${courseId}`, {
        data: { instructor_id: instructorId },
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setCourses(courses.filter((course) => course.course_id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axiosInstance.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedImageUrl = response.data.imageUrl;
      setImageUrl(uploadedImageUrl);
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        image_url: uploadedImageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <CategoryMenu />
      <div className="dashboard-container">
        <h1 className="dashboard-heading">Instructor Dashboard</h1>

        <div className="course-list-section">
          <h2>Your Courses</h2>
          {courses.length === 0 ? (
            <p>No courses found</p>
          ) : (
            <div className="course-list">
              {courses.map((course) => (
                <div className="course-card" key={course.course_id}>
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-main-details">
                    <p>
                      <strong>{course.title}</strong>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <strong>
                        {course.average_rating}{" "}
                        <GradeIcon sx={{ color: "orange", fontSize: 20 }} />
                      </strong>
                    </p>
                    <p>
                      <strong>Level:</strong> {course.level}
                    </p>
                    <p>
                      <strong>Language:</strong> {course.language}
                    </p>
                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => editCourse(course)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCourse(course.course_id)}
                      >
                        Delete
                      </button>
                      <NavLink
                        to={`/instructor/${instructorId}/course/${course.course_id}/reviews`}
                        state={{ courseTitle: course.title }}
                      >
                        Reviews
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="course-form-section">
          <h2>{editingCourse ? "Edit Course" : "Create New Course"}</h2>
          <form
            className="course-form"
            onSubmit={editingCourse ? updateCourse : createCourse}
          >
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newCourse.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newCourse.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={newCourse.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount_price">Discount Price</label>
              <input
                type="number"
                id="discount_price"
                name="discount_price"
                value={newCourse.discount_price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input type="file" onChange={handleFileChange} accept="image/*" />
              <button onClick={handleUpload}>Upload Image</button>
              {imageUrl && (
                <div>
                  <h2>Uploaded Image:</h2>
                  <img src={imageUrl} alt="Uploaded" width="300" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={newCourse.category_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                name="level"
                value={newCourse.level}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a level
                </option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <input
                type="text"
                id="language"
                name="language"
                value={newCourse.language}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">
              {editingCourse ? "Update Course" : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InstructorDashboard;
