import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard.js';
import axios from 'axios';
import { useAuth } from '../../Context/auth';
import Navbar from '../Home/NavBar.js';
import "./student.css"
import Footer from '../Home/Footer.js';
import noContent from './we.png';

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
        const token = auth?.token; 

        const response = await axios.get(`http://localhost:8080/api/enrollments/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
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
    <div className='enrollment-courses-page'>
      <h2>My Enrolled Courses</h2>
      {courses.length === 0 ? (
         <div className="no-content-student">
         <div>
           <img src={noContent} style={{width:"300px",height:"200px",position:"relative",right:"50px"}} alt="No content available" />
         <p>You are not enrolled in any course.</p>
         </div>
         </div>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <CourseCard 
              key={course.enrollment_id} 
              course={course} 
              userId={userId} 
            />
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default StudentDashboard;
