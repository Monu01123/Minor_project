import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { useAuth } from "../../Context/auth.js";
import logo from "./logo.png";
import Modal from "./modal.js";
import { useCart } from "./CartContext.js";
import { useWishlist } from "./WishlistContext.js";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownTwoToneIcon from "@mui/icons-material/ArrowDropDownTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import UserProfile from "../Student/Profile.js";

const Navbar = () => {
  const [auth] = useAuth();
  const { wishlistCount, updateWishlistCount } = useWishlist();
  const { cartCount, updateCartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  useEffect(() => {
    const fetchCartCount = async () => {
      if (auth?.user) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/cart/count/${auth.user.user_id}`
          );
          updateCartCount(response.data.count || 0); // Update cart count
        } catch (error) {
          console.error("Error fetching cart count:", error.message);
        }
      }
    };

    fetchCartCount();
  }, [auth, updateCartCount]);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      // console.log("caaledfdlfkdjf");
      if (auth?.user) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/wishlist/count/${auth.user.user_id}`
          );
          updateWishlistCount(response.data.wishlist_count || 0);
          // console.log(response);
        } catch (error) {
          console.error("Error fetching cart count:", error.message);
        }
      }
    };

    fetchWishlistCount();
  }, [auth, updateWishlistCount]);

  const userRole = auth?.user?.role;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "http://localhost:3000/category/1";
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/search?keyword=${encodeURIComponent(
            searchTerm
          )}`
        );
        setSearchResults(response.data);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error searching for courses:", error.message);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="logo-name">Skillora</h2>
        </div>
      </NavLink>

      <div
        className="categories-dropdown"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button className="dropdown-btn">
          <span className="category-icon">Categories</span>
          <ArrowDropDownTwoToneIcon className="drop-downicon" />
        </button>
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

      <div className="menu-icon">
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </div>

      <div className={`navbar-items ${isMenuOpen ? "active" : ""}`}>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="What do you want to learn?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" type="submit">
            <SearchIcon className="search-icon" />
          </button>
        </form>

        {/* Modal for displaying search results */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          results={searchResults}
        />

        <div className="navbar-right">
          {!auth?.user && (
            <>
              <NavLink
                to="/login"
                className="nav-link login-btn"
                data-text="Log in"
              >
                {/* Log in */}
              </NavLink>
              <NavLink
                to="/register"
                className="nav-link signup-btn"
                data-text="Sign up"
              >
                {/* Sign up */}
              </NavLink>
            </>
          )}

          {userRole === "student" && (
            <>
              <NavLink to="/student-dashboard" className="nav-link">
                My Courses
              </NavLink>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="nav-icon" />
                <span className="cart-count">{cartCount}</span>
              </NavLink>
              <NavLink to="/wishlist" style={{ textDecoration: "none" }}>
                <FavoriteBorderOutlinedIcon className="nav-icon" />
                <span className="cart-count">{wishlistCount}</span>
              </NavLink>
              <span className="profile-menu">
                <AccountBoxOutlinedIcon
                  className="nav-icon profile-icon"
                  onClick={toggleProfileDropdown}
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <UserProfile />
                  </div>
                )}
              </span>
              <NavLink to="/" className="nav-link" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          )}

          {userRole === "admin" && (
            <>
              <NavLink to="/instructor-dashboard/category" className="nav-link">
                Admin Dashboard
              </NavLink>
              <NavLink to="/wishlist" style={{ textDecoration: "none" }}>
                <FavoriteBorderOutlinedIcon className="nav-icon" />
                <span className="cart-count">{wishlistCount}</span>
              </NavLink>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="nav-icon" />
                <span className="cart-count">{cartCount}</span>
              </NavLink>
              <span className="profile-menu">
                <AccountBoxOutlinedIcon
                  className="nav-icon profile-icon"
                  onClick={toggleProfileDropdown}
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <UserProfile />
                  </div>
                )}
              </span>
              <NavLink to="/" className="nav-link" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          )}

          {userRole === "instructor" && (
            <>
              <NavLink to="/student-dashboard" className="nav-link">
                My <br />
                Courses
              </NavLink>
              <NavLink to="/instructor-dashboard/course" className="nav-link">
                Instructor
                <br /> Dashboard
              </NavLink>
              <NavLink to="/wishlist" style={{ textDecoration: "none" }}>
                <FavoriteBorderOutlinedIcon className="nav-icon" />
                <span className="cart-count">{wishlistCount}</span>
              </NavLink>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="nav-icon" />
                <span className="cart-count">{cartCount}</span>
              </NavLink>
              <span className="profile-menu">
                <AccountBoxOutlinedIcon
                  className="nav-icon profile-icon"
                  onClick={toggleProfileDropdown}
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <UserProfile />
                  </div>
                )}
              </span>
              <NavLink to="/" className="nav-logout" onClick={handleLogout}>
                <LogoutIcon />
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
