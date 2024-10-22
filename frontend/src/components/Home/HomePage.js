import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Navbar from './NavBar';
import CategoryList from './Categorylist';
import './HomePage.css';
import GradeIcon from '@mui/icons-material/Grade';

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/courses/category/1') 
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const calculateDiscountPrice = (price, discountPrice) => {
    return discountPrice ? discountPrice : price;
  };

  return (
    <>
      <Navbar />
      <CategoryList />
      <div className="course-list">
        {courses.map(course => (
          <NavLink to={`/courses/${course.course_id}`} key={course.course_id} className="view-course-button">
            <div className="course-card" key={course.course_id}>
              <img src={course.image_url} alt={course.title} className="course-image" />
              <div className="course-main-details">
                <p><strong>{course.title}</strong></p>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                  <strong>{course.average_rating} <GradeIcon sx={{ color: 'orange', fontSize: 20 }} /></strong>
                </p>
                <p><strong>Level:</strong> {course.level}</p>
                <p><strong>Language:</strong> {course.language}</p>
                <p className="price">
                  <span className="discounted-price">${calculateDiscountPrice(course.price, course.discount_price)}</span>
                  {course.discount_price && <span className="original-price">${course.price}</span>}
                </p>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default HomePage;
