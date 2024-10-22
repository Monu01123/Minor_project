// src/components/StudentDashboard.js
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import axios from 'axios';
import { useAuth } from '../../Context/auth';
import Navbar from '../Home/NavBar.js';

const StudentDashboard = () => {
  const [auth] = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = auth?.user?.user_id;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userId) return;

      try {
        const token = auth?.token; // Get the token from auth context

        const response = await axios.get(`http://localhost:8080/api/enrollments/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        });

        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Error fetching enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId, auth]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <Navbar/>
    <div>
      <h2>My Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <CourseCard 
              key={course.enrollment_id} 
              course={course} 
              userId={userId} // Pass userId to CourseCard
            />
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default StudentDashboard;
