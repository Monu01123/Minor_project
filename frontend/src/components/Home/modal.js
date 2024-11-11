import React from "react";
import "./Navbar.css"; 
import { NavLink } from "react-router-dom";

const Modal = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null; 

  return (
    <div className="search-overlay">
      <div className="search-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Search Results</h2>
        {results.length > 0 ? (
          <ul className="search-model">
            {results.map((course) => (
              <NavLink
                to={`/courses/${course.course_id}`}
                key={course.course_id}
                className={"searchresult"}
                onClick={onClose}
              >
                <li key={course.course_id}>
                  <img
                    src={course.image_url}
                    alt={course.title}
                  />
                    <h3>
                      {course.title}
                    </h3>
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
