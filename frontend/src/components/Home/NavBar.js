import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { useAuth } from "../../Context/auth.js";
import logo from "./logo.png";

const Navbar = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const userRole = auth?.user?.role;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "http://localhost:3000/category/1";
  };

  return (
    <nav className="navbar">
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="logo-name">Skillora</h2>
        </div>
      </NavLink>

      <div className="search-bar">
        <div
          className="categories-dropdown"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="dropdown-btn">Categories</button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              {categories.map((category) => (
                <NavLink
                  key={category.category_id}
                  to={`/category/${category.category_id}`}
                  className="dropdown-link"
                >
                  {category.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <input type="text" placeholder="Search for anything" />
      </div>

      <div className="navbar-right">
        {!auth?.user && (
          <>
            <NavLink to="/login" className="nav-link login-btn">
              Log in
            </NavLink>
            <NavLink to="/register" className="nav-link signup-btn">
              Sign up
            </NavLink>
          </>
        )}

        {userRole === "student" && (
          <>
            <NavLink to="/student-dashboard" className="nav-link">
              My Courses
            </NavLink>
            <NavLink to="/cart">
              <ShoppingCartOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/wishlist">
              <FavoriteBorderOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/profile">
              <AccountBoxOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/" className="nav-link" onClick={handleLogout}>
              Logout
            </NavLink>
          </>
        )}

        {userRole === "admin" && (
          <>
            <NavLink to="/admin-dashboard" className="nav-link">
              Admin Dashboard
            </NavLink>
            <NavLink to="/wishlist">
              <FavoriteBorderOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/cart">
              <ShoppingCartOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/profile">
              <AccountBoxOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/" className="nav-link" onClick={handleLogout}>
              Logout
            </NavLink>
          </>
        )}

        {userRole === "instructor" && (
          <>
            <NavLink to="/instructor-dashboard" className="nav-link">
              Instructor Dashboard
            </NavLink>
            <NavLink to="/wishlist">
              <FavoriteBorderOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/cart">
              <ShoppingCartOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/profile">
              <AccountBoxOutlinedIcon className="nav-icon" />
            </NavLink>
            <NavLink to="/" className="nav-link" onClick={handleLogout}>
              Logout
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
