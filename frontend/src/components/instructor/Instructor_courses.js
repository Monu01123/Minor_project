// // InstructorCourses.js
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../Context/auth.js";
// import axiosInstance from "../../axiosconfig.js";
// import { useNavigate } from "react-router-dom";
// // import Navbar from "../Home/NavBar.js";
// import Instructormenu from "./CategoryMenu.js";

// const InstructorCourses = () => {
//   const [auth] = useAuth();
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();

//   const instructorId = auth?.user?.user_id;

//   useEffect(() => {
//     if (instructorId) {
//       fetchCourses();
//     }
//   }, [instructorId]);

//   const fetchCourses = () => {
//     axiosInstance
//       .get(`/api/courses/instructor/${instructorId}`)
//       .then((response) => setCourses(response.data))
//       .catch((error) => console.error("Error fetching courses:", error));
//   };

//   return (
//     <>
//       {/* <Instructormenu /> */}
//       <div>
//         <h1>Your Courses</h1>
//         {courses.length === 0 ? (
//           <p>No courses found</p>
//         ) : (
//           <ul>
//             {courses.map((course) => (
//               <li key={course.course_id}>
//                 <h3>{course.title}</h3>
                
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </>
//   );
// };

// export default InstructorCourses;
