import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosconfig.js";
import { useAuth } from "../../Context/auth.js";
import { NavLink} from "react-router-dom";
import Navbar from "../Home/NavBar.js";
import Footer from "../Home/Footer.js";
import "./dashboard3D.css";

const Dashboard = () => {
  const [auth] = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const instructorId = auth?.user?.user_id;

  useEffect(() => {
    if (instructorId) {
      fetchCourses();
    }
  }, [auth, instructorId]);

  const fetchCourses = () => {
    axiosInstance
      .get(`/api/courses/instructor/${instructorId}`)
      .then((response) => {
        const fetchedCourses = response.data || [];
        
        const coursesWithEnrollments = fetchedCourses.map(async (course) => {
          console.log("sdkfjhdjkfh"+course);
          const enrollmentCount = await fetchEnrollmentCount(course.course_id);
          console.log(enrollmentCount+ " " + course.discount_price);
          const earnings = course.discount_price * enrollmentCount;
          // console.log("this is earmign"+earnings);
          return { ...course, enrollmentCount, earnings };
        });
        Promise.all(coursesWithEnrollments).then((updatedCourses) => {
          setCourses(updatedCourses);
          const total = updatedCourses.reduce(
            (acc, course) => acc + course.earnings,
            0
          );
          setTotalEarnings(total);
        });
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
      });
  };

  const fetchEnrollmentCount = async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `/api/courses/${courseId}/enrollment-count`
      );
      return response.data.enrollmentCount || 0;
    } catch (error) {
      console.error(
        `Error fetching enrollment count for course ${courseId}:`,
        error
      );
      return 0;
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  return (
    <>
      <Navbar />
      <div>
      <h1 className="instructor-dashboard-heading">My Earnings | <span><NavLink to="/instructor-dashboard/course" className="url earnings"> MY Courses</NavLink> </span></h1>
      <div className="dash-container">
        <div className="dash-course-list">
          <h2>Your Courses</h2>
          {courses.length === 0 ? (
            <p>No courses found</p>
          ) : (
            courses.map((course) => (
              <div
                key={course.course_id}
                className={`dash-course-item ${
                  selectedCourse?.course_id === course.course_id ? "active" : ""
                }`}
                onClick={() => handleCourseClick(course)}
              >
                <strong>{course.title}</strong>
              </div>
            ))
          )}
        </div>
        <div className="dash-course-details">
          {selectedCourse ? (
            <div className="dash-course-itemin">
              <p>{selectedCourse.title}</p>
              <p><span style={{fontSize:"1rem"}}>Enrolled Students:</span> {(selectedCourse.enrollmentCount)-1}</p>
              <p><span style={{fontSize:"1rem"}}>Earnings: </span>₹{(selectedCourse.earnings.toFixed(2))-(selectedCourse.discount_price)}</p>
            </div>
          ) : (
            <p>Select a course to view details</p>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
