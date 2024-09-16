import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import thumbnail from '../assets/thumbnail.png';

const CourseCard = ({ course, showButtons }) => {
  const {
    course_id,
    title,
    image_url,
    price,
    discount_price,
    average_rating,
    level,
    language
  } = course;

  return (
    
    <div className='mx-auto font-sans'>
      <div className='w-72 text-left shadow-lg m-4 rounded-2xl bg-white overflow-hidden'>
        {/* Wrap the entire card in a Link to make it clickable */}
        <Link to={`/content/${course_id}`}>
          {/* Course Thumbnail */}
          <img 
            src={thumbnail || image_url} 
            className='w-full h-40 object-cover' 
            alt="Course Thumbnail" 
          />

          <div className='p-3'>
            {/* Course Title */}
            <h1 className="text-xl font-bold mb-2 text-gray-800 hover:text-gray-600 transition-colors duration-300">{title}</h1>

            {/* Course Rating */}
            <h2 className="text-sm font-medium text-yellow-500 mb-2 flex items-center">
              {average_rating} ★ <span className="text-gray-500 ml-2">(69 reviews)</span>
            </h2>

            {/* Course Price */}
            <div className='mb-3'>
              {discount_price ? (
                <div className='flex'>
                  <h2 className="text-lg font-bold text-gray-500 line-through mr-4">₹{price}</h2>
                  <h2 className="text-lg font-bold text-green-600">₹{discount_price}</h2>
                </div>
              ) : (
                <h2 className="text-lg font-bold text-green-600">₹{price}</h2>
              )}
            </div>

            {/* Course Level and Language */}
            <div className='flex justify-between text-sm text-gray-700'>
              <span className="font-medium">LEVEL : {level.toUpperCase()}</span>
              <span className="font-medium">{language.toUpperCase()}</span>
            </div>
          </div>
        </Link>

        {/* Conditionally render Add to Cart and Add to Wishlist buttons */}
        {showButtons && (
          <div className='p-3 mt-2 flex justify-between'>
            <button className='bg-green-500 text-white px-4 py-2 rounded'>Add to Cart</button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded'>Add to Wishlist</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
