import React from 'react'
import thumbnail from '../assets/thumbnail.png'
const CourseCard = () => {
  return (
   <div className='mx-auto'>
     <div className='w-64 text-left shadow-2xl m-2 rounded-3xl font-sans bg-white'>
  <img src={thumbnail} className='w-full rounded-lg' alt="Course Thumbnail" />
  
  <div className='p-2'>
    <h1 className="text-lg font-bold mb-2">ChatGPT Complete Guide: Learn Midjourney, ChatGPT 4 & More</h1>
    <h1 className="text-sm font-medium text-gray-700 mb-2">Ankush Patidar, Vishal Jatav</h1>
    <h1 className="text-sm font-semibold text-yellow-500 mb-2">
      4.8 ★ <span className="text-gray-500">(69 reviews)</span>
    </h1>
    <h1 className="text-xl font-bold text-green-600 leading-tight">₹6,969</h1>
  </div>
</div>

   </div>
  )
}

export default CourseCard
