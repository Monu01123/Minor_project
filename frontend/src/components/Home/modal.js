import React from "react";
import "./Navbar.css"; // Add the CSS for this layout
import { NavLink } from "react-router-dom";

const Modal = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Search Results</h2>
        {results.length > 0 ? (
          <ul className="course-list">
            {results.map((course) => (
               <NavLink to={`/courses/${course.course_id}`} key={course.course_id} className="view-course-button">
              <li key={course.course_id} className="course-item" style={{height:"100px",padding:"0px"}}>
                <img src={course.image_url} style={{width:"50px",height:"50px"
                }} alt={course.title} className="course-image" />
                <div className="course-details">
                  <h3 className="course-title" style={{fontSize:"10px"}}>{course.title}</h3>
                  <p className="course-instructor">Course • {course.instructor_name}</p>
                </div>
              </li>
              </NavLink>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
