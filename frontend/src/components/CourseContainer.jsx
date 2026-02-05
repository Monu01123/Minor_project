import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from './CourseCard';
import Category from './Category';
import axiosInstance from '../axiosconfig.js';

const CourseContainer = () => {
  const { category_id } = useParams(); // Get category_id from the URL
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To programmatically navigate

  useEffect(() => {
    const activeCategoryId = category_id || 1;

    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(`/api/courses/category/${activeCategoryId}`);
        const data = response.data;
        const coursesArray = Array.isArray(data) ? data : [data];
        setCourses(coursesArray); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (!category_id) {
      navigate(`/courses/1`); 
    }

    fetchCourses();
  }, [category_id, navigate]);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='max-w-screen-xl mx-auto flex flex-wrap bg-gray-100 p-4'>
      <Category />
      <div className='flex flex-wrap gap-4'>
        {courses.map(course => (
          <CourseCard key={course.course_id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseContainer;
