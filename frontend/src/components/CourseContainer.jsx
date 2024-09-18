import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from './CourseCard';
import Category from './Category';

const CourseContainer = () => {
  const { category_id } = useParams(); // Get category_id from the URL
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To programmatically navigate

  useEffect(() => {
    // Check if category_id is undefined or null, then default to 1
    const activeCategoryId = category_id || 1;

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/category/${activeCategoryId}`);
        const data = response.data;

        // If the response is an object, convert it to an array
        const coursesArray = Array.isArray(data) ? data : [data];

        setCourses(coursesArray); // Set the fetched courses as an array
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (!category_id) {
      navigate(`/courses/1`); // Redirect to category 1 if no category_id in URL
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
