import React from 'react';
import { Navigate } from 'react-router-dom';

// Protected route for instructor-only pages
const InstructorRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || !auth.token) {
    return <Navigate to="/login" />;
  }

  if (auth.user.role !== 'instructor' && auth.user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Allow access to the page if logged in and role is 'instructor'
  return children;
};

export default InstructorRoute;
