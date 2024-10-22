import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../Home/NavBar";
import { useParams } from "react-router-dom";

const Instructormenu = () => {
  const courseId = useParams();
  return (
    <>
      <Navbar />
      <div>
        <h1>Category Menu</h1>
        <NavLink to="/instructor-dashboard/category">Category</NavLink>
        <NavLink to="/instructor-dashboard/course">Course</NavLink>
        <NavLink to="/instructor/courses">Content</NavLink>
      </div>
    </>
  );
};

export default Instructormenu;
