import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig.js";
import { useAuth } from "../../Context/auth.js";
import "./dashboard.css";
import GradeIcon from "@mui/icons-material/Grade";
import Navbar from "../Home/NavBar.js";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Footer from "../Home/Footer.js";

const InstructorDashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
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
  const [categories, setCategories] = useState([]);
  const instructorId = auth?.user?.user_id;

  useEffect(() => {
    if (instructorId) {
      fetchCourses();
      fetchCategories();
    }
  }, [auth, instructorId]);

  const fetchCourses = () => {
    axiosInstance
      .get(`/api/courses/instructor/${instructorId}`)
      .then((response) => setCourses(response.data || []))
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]); // Ensure courses is always an array on error
      });
  };

  const fetchCategories = () => {
    axiosInstance
      .get("/categories")
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
      <Navbar />
      <div className="instructor-dashboard">
        <h1 className="instructor-dashboard-heading">Your Courses</h1>
        <div className="">
          {courses.length === 0 ? (
            <div className="manage-no-course">
              <h4>No courses found</h4>
            </div>
          ) : (
            <div className="instructor-course-card-list">
              {Array.isArray(courses) &&
                courses.map((course) => (
                  <div
                    className="instructor-course-card"
                    key={course.course_id}
                  >
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="course-image"
                    />
                    <div className="instructor-card-items">
                      <span className="title">
                        <strong>
                          {course?.title?.length > 18
                            ? `${course.title.substring(0, 18)}...`
                            : course?.title || ""}
                        </strong>
                        <button
                          className="instructor-course-edit-btn"
                          onClick={() => editCourse(course)}
                        >
                          <EditOutlinedIcon className="editbtn" />
                        </button>
                      </span>
                      <div className="instructor-course-details">
                        <strong className="rating">
                          {course.average_rating !== undefined &&
                          !isNaN(Number(course.average_rating))
                            ? Number(course.average_rating) === 0
                              ? 0
                              : Number(course.average_rating).toFixed(1)
                            : "N/A"}
                          <GradeIcon sx={{ color: "orange", fontSize: 20 }} />
                        </strong>
                        <span>{course.level}</span>
                        <span>{course.language}</span>
                      </div>
                      <div className="instructor-courses-btns">
                        <button
                          className="instructor-course-delete-btn"
                          onClick={() => deleteCourse(course.course_id)}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                        <button
                          className="instructor-course-other-btn"
                          onClick={() =>
                            navigate(
                              `/instructor/${instructorId}/course/${course.course_id}/reviews`,
                              {
                                state: { courseTitle: course.title },
                              }
                            )
                          }
                        >
                          Reviews
                        </button>

                        <button
                          className="instructor-course-other-btn"
                          onClick={() =>
                            navigate(
                              `/instructor/course/${course.course_id}/content`,
                              {
                                state: { courseName: course.title },
                              }
                            )
                          }
                        >
                          Manage Content
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="instructor-course-edit">
          <h2>{editingCourse ? "Edit Course" : "Create New Course"}</h2>
          <form
            className=""
            onSubmit={editingCourse ? updateCourse : createCourse}
          >
            <div className="">
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
            <div className="">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newCourse.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
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
            <div className="">
              <label htmlFor="discount_price">Discount Price</label>
              <input
                type="number"
                id="discount_price"
                name="discount_price"
                value={newCourse.discount_price}
                onChange={handleChange}
              />
            </div>
            <div className="image-upload-courses-instructor">
              <input type="file" onChange={handleFileChange} accept="image/*" />
              <button onClick={handleUpload}>Upload Image</button>
              {imageUrl && (
                <div>
                  <h2>Uploaded Image:</h2>
                  <img src={imageUrl} alt="Uploaded" width="300" />
                </div>
              )}
            </div>
            <div className="">
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
            <div className="">
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
            <div className="">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={newCourse.language}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a language
                </option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <button type="submit">
              {editingCourse ? "Update Course" : "Create Course"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InstructorDashboard;
