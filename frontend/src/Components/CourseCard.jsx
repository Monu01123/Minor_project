// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom'; 

// const CourseCard = ({ course, showButtons }) => {

//   const {
//     course_id,
//     title,
//     image_url,
//     price,
//     discount_price,
//     average_rating,
//     level,
//     language
//   } = course;

//   return (
//     <div className='mx-auto font-sans'>
//       <div className='w-72 text-left shadow-lg m-4 rounded-2xl bg-white overflow-hidden'>
//         <Link to={`/content/${course_id}`}>
//           <img 
//             src={image_url} 
//             className='w-full h-40 object-cover' 
//             alt="Course Thumbnail" 
//           />

//           <div className='p-3'>
//             <h1 className=" text-lg font-bold mb-2 text-gray-800 hover:text-gray-600 transition-colors duration-300">{title}</h1>
//             <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//               {average_rating} ★ <span className="text-gray-500 ml-2">(690 reviews)</span>
//             </h2>
//             <div className='mb-3'>
//               {discount_price ? (
//                 <div className='flex'>
//                   <h2 className="text-base font-bold text-gray-700 line-through mr-4">₹{price}</h2>
//                   <h2 className="text-base font-bold text-gray-900">₹{discount_price}</h2>
//                 </div>
//               ) : (
//                 <h2 className="text-base font-bold text-gray-900">₹{price}</h2>
//               )}
//             </div>
//             <div className='flex justify-between text-sm text-gray-600'>
//               <span className="font-medium">LEVEL : {level.toUpperCase()}</span>
//               <span className="font-medium">{language.toUpperCase()}</span>
//             </div>
//           </div>
//         </Link>

//         {showButtons && (
//           <div className='p-3 mt-2 flex justify-between'>
//             <button className='bg-green-500 text-white px-4 py-2 rounded'>Add to Cart</button>
//             <button className='bg-blue-500 text-white px-4 py-2 rounded'>Add to Wishlist</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseCard;
