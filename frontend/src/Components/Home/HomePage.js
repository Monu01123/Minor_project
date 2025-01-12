import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import Navbar from './NavBar';
import CategoryList from './Categorylist';
import './HomePage.css';  
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded';
import Footer from "./Footer.js";

const HomePage = () => {
  const { categoryId } = useParams();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/courses/category/1`)
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, [categoryId]);

  const formatTitle = (title) => {
    return title.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <Navbar/>
      <CategoryList/>
      <div className="course-list">
        {courses.map(course => (
          <NavLink to={`/courses/${course.course_id}`} key={course.course_id} className="view-course-button">
          <div className="course-card" key={course.course_id}>
            <img src={course.image_url} alt={course.title} className="course-image" />
            <div className="course-main-details">
              <h5 className='course-instructor'><PortraitRoundedIcon fsx={{ fontSize: 10 }} className='instructor-icon'/> {formatTitle(course.instructor_name)}</h5>
              <h4>{course.title.length > 24 ? `${course.title.substring(0, 24)}...` : course.title}</h4>
              <h5 className='course-level'>{formatTitle(course.level)}</h5>
            </div>
          </div>
          </NavLink>
        ))}
      </div>
      <Footer/>
    </>
  );
};

export default HomePage;
