import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaVideo, FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa'; // Import necessary icons
import CourseCard from './CourseCard';


const ContentPage = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8080/api/courses/${course_id}`);
        setCourse(courseResponse.data);

        // Fetch course content
        const contentResponse = await axios.get(`http://localhost:8080/api/content/${course_id}`);
        setContent(contentResponse.data);

        // Fetch course reviews
        const reviewsResponse = await axios.get(`http://localhost:8080/api/reviews/course/${course_id}`);
        setReviews(reviewsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course_id]);

  if (loading) {
    return <p>Loading content...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
    <div>
      <div className='flex'>
        {/* Left side: Course Content */}
        <div className='w-2/3 p-4 bg-gray-100 border border-black mx-1'>
          <h2 className='text-3xl font-bold mb-6 text-blue-600 border-b pb-2'>Course Content</h2>
          <ul className='list-none'>
            {content.map(item => (
              <li 
                key={item.content_id} 
                className='mb-4 flex items-center justify-between p-2 rounded-md bg-white shadow-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer'
                onClick={() => window.open(item.content_url, '_blank')}
              >
                <div className='flex items-center'>
                  <FaVideo className='text-blue-600 mr-3' /> {/* Video icon */}
                  <h3 className='font-semibold'>{item.title}</h3>
                </div>
                <span className='text-gray-600'>{Math.floor(item.duration / 60)} mins</span> {/* Duration */}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: Course Card with Add to Cart and Wishlist buttons */}
        <div className='w-1/3 p-4 border-l border-gray-300'>
          {course && (
            <CourseCard course={course} showButtons={true} /> //{/* Pass prop to show buttons */}
          )}
        </div>
      </div>
   
      {/* User Reviews Section */}
      <div className=' p-4 bg-gray-100 flex border border-black mx-1'>
  <div className='w-max rounded-lg'>
    <h2 className='text-3xl font-bold mb-6 text-blue-600 border-b pb-2'>User Reviews</h2>
    <div className='flex flex-wrap'>
    {reviews.length > 0 ? (
      reviews.map(review => (
        <div 
          key={review.review_id} 
          className='p-6 mb-6 mx-2 bg-white shadow-lg rounded-md'>
          <div className='flex items-center mb-3'>
            {/* Placeholder user logo */}
            <div className='bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3'>
             {review.user_name[0].toUpperCase()}
            </div>
            <h3 className='font-semibold'>{review.user_name}</h3>
          </div>
          <p className='text-gray-700 mb-3'>{review.comment}</p>
          
          {/* Display rating using star emojis */}
          <div className='flex items-center text-yellow-500 mb-4'>
            {Array(review.rating).fill('⭐️').map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>

          {/* Like, Dislike, Report buttons as icons */}
          <div className='flex space-x-4'>
            <button className='text-gray-600 hover:text-blue-500 flex items-center'>
              <FaThumbsUp className='text-lg' />
            </button>
            <button className='text-gray-600 hover:text-red-500 flex items-center'>
              <FaThumbsDown className='text-lg' />
            </button>
            <button className='text-gray-600 hover:text-yellow-500 flex items-center'>
              <FaFlag className='text-lg' />
            </button>
          </div>
        </div>
      ))
    ) : (
      <p>No reviews yet. Be the first to review this course!</p>
    )}
    </div>
  </div>
</div>

    </div>
    </>
  );
};

export default ContentPage;
