import React from 'react'
import CourseCard from './CourseCard'
import herobg from '../assets/herobg4.jpg'

const CourseContainer = () => {
  return (
    <div className='max-w-screen-xl mx-auto  flex flex-wrap bg-repeat'  style={{ backgroundImage: `url(${herobg})`, backgroundSize: 'auto' }}>
      <CourseCard/>
      <CourseCard/>
      <CourseCard/>
      <CourseCard/>
      <CourseCard/>
      <CourseCard/>
      <CourseCard/>
      <CourseCard/>
      
      
    </div>
  )
}

export default CourseContainer
