import React from 'react';
import { Navigate } from 'react-router-dom';

// Protected route for instructor-only pages
const InstructorRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || !auth.token) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" />;
  }

  // Check if the user has an 'instructor' role
  if (auth.user.role !== 'instructor') {
    // Redirect to a 'not authorized' page or home page
    return <Navigate to="/not-authorized" />;
  }

  // Allow access to the page if logged in and role is 'instructor'
  return children;
};

export default InstructorRoute;