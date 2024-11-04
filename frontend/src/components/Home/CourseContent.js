import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./NavBar.js";
import "./HomePage.css";
import Reviews from "./Reviews.js";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import GradeIcon from "@mui/icons-material/Grade";
// import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useAuth } from "../../Context/auth.js";
import axiosInstance from "../../axiosconfig.js";
import { useCart } from "./CartContext.js";
import { useWishlist } from "./WishlistContext.js";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CourseContent = () => {
  const { courseId } = useParams();
  const { updateCartCount } = useCart();
  const { updateWishlistCount } = useWishlist();
  const [courseDetails, setCourseDetails] = useState(null);
  const [content, setContent] = useState([]);
  const [auth] = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const token = auth?.token;

    axios
      .get(`http://localhost:8080/api/courses/${courseId}`)
      .then((response) => {
        console.log("Course Details Response j:", response.data);
        setCourseDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });

    const fetchCourseContent = async () => {
      try {
        let response;
        response = await axiosInstance.get(`api/content/enrolled/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Course Content Response:", response.data);
        const content = response.data;
        setContent(content.length === 0 ? [] : content);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();

    if (auth?.user?.user_id) {
      const fetchUserItems = async () => {
        const userId = auth?.user?.user_id;
        const token = auth?.token;

        if (!userId || !token) {
          setError("User ID or token is not available.");
          return;
        }

        setLoading(true);
        try {
          const cartResponse = await axiosInstance.get(
            `/api/cart/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token here
              },
            }
          );
          setCartItems(cartResponse.data);

          const wishlistResponse = await axiosInstance.get(
            `/api/wishlist/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token here
              },
            }
          );
          setWishlistItems(wishlistResponse.data);
        } catch (error) {
          console.error("Error fetching user items:", error); // Handle the error here
          setError(`Error fetching user items: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchUserItems();
    }

    const checkEnrollmentStatus = async () => {
      if (auth?.user?.user_id) {
        const token = auth?.token;
        try {
          const response = await axiosInstance.get(
            `/api/enrollments/user/${auth.user.user_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const enrolledCourses = response.data.map(
            (enrollment) => enrollment.course_id
          );
          setEnrolled(enrolledCourses.includes(Number(courseId)));
        } catch (error) {
          console.error("Error checking enrollment status:", error);
        }
      }
    };

    checkEnrollmentStatus();
  }, [auth, courseId]);

  const AddToCart = async (courseId) => {
    const userId = auth?.user?.user_id;
    const token = auth?.token;

    if (!userId) {
      alert("Please log in first to add this course to your cart.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/cart",
        {
          user_id: userId,
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token
          },
        }
      );
      console.log("Course added to cart:", response.data.message);

      // Update cart count in Navbar
      const newCartCount = await fetchCartCount(); // You'll need to define this method to fetch the updated cart count
      updateCartCount(newCartCount); // Update the cart count in Navbar
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(
          "Error adding course to cart:",
          error.response.data.message
        );
        alert(error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const AddToWishlist = async (courseId) => {
    const userId = auth?.user?.user_id;
    const token = auth?.token;

    // Check if the user is logged in
    if (!userId) {
      alert("Please log in first to add this course to your wishlist.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/wishlist",
        {
          user_id: userId,
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token
          },
        }
      );
      console.log("Course added to wishlist:", response.data.message);
      const newWishlistCount = await fetchWishlistCount(); // You'll need to define this method to fetch the updated cart count
      updateWishlistCount(newWishlistCount); // Update the cart count in Navbar
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(
          "Error adding course to wishlist:",
          error.response.data.message
        );
        alert(error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  function convertMinutesToHours(minutes) {
    if (minutes < 60) {
      return `${minutes} minute`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hours`;
    }
    return `${hours} hr ${remainingMinutes} minute`;
  }

  const handleOpenCourseContentPage = () => {
    navigate(`/courses-content/${courseId}`); // Navigate to CourseContentPage
  };

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

  const fetchWishlistCount = async () => {
    if (auth?.user) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/wishlist/count/${auth.user.user_id}`
        );
        updateWishlistCount(response.data.wishlist_count || 0); // Update cart count
      } catch (error) {
        console.error("Error fetching cart count:", error.message);
      }
    }
  };

  fetchWishlistCount();

  return (
    <>
      <Navbar />
      <div className="course-content-container">
        {courseDetails ? (
          <main className="Course-content-section">
            <div className="course-details uur">
              <h1>{courseDetails.title}</h1>
              <p>{courseDetails.description}</p>
              <p style={{ display: "flex", alignItems: "center" }}>
                <TranslateRoundedIcon /> Taught in {courseDetails.language}
              </p>
              <p className="course-instructor"> Created by <span>{courseDetails.instructor_name}</span></p>
              {courseDetails.discount_price && (
                <p>${courseDetails.discount_price}</p>
              )}
              {enrolled ? (
                <>
                  <p></p>
                </>
              ) : (
                <div className="course-content-buttons">
                  <button
                    onClick={() => AddToCart(courseId)}
                    className="btn_course_content"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => AddToWishlist(courseId)}
                    className="btn_course_content2"
                  >
                    <FavoriteBorderIcon fontSize="small" style={{color:"#007791"}}/>
                  </button>
                </div>
              )}

              <button
                onClick={handleOpenCourseContentPage}
                className="btn_course_content"
              >
                Go to Course
              </button>
              {message && <p className="message">{message}</p>}
              <p><b>{courseDetails.enrollment_count}</b> already enrolled </p>
            </div>
          </main>
        ) : (
          <p>Loading course details...</p>
        )}

        {courseDetails ? (
          <>
            <div className="course-content-section1">
              <div>
                {courseDetails.average_rating || "No rating"}{" "}
                <GradeIcon sx={{ color: "orange" }} />
              </div>
              <div className="divider-section"></div>
              <div>
                {courseDetails.level.charAt(0).toUpperCase() +
                  courseDetails.level.slice(1).toLowerCase() ||
                  "No level available"}{" "}
                level
              </div>
              <div className="divider-section"></div>
              <div>{courseDetails.language || "No language available"}</div>
            </div>
          </>
        ) : (
          <p>Loading course details...</p>
        )}

        <div className="certificate-section">
          <div className="certificate-content">
            <h2>Earn a career certificate</h2>
            <p>Add this credential to your LinkedIn profile, resume, or CV</p>
            <p>Share it on social media and in your performance review</p>
          </div>
          <div className="certificate-image">
            <img
              src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/images/de1a6556fbe605411e8c1c2ca4ba45f1.png?auto=format%2Ccompress&dpr=1&w=333&h=215&q=40"
              alt="certificate"
              className="certificate-img"
            />
          </div>
        </div>

        <div className="content">
          <h1>Course Content</h1>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading content...</p>
          ) : (
            <div>
              {content.map((item) => (
                <div key={item.content_id}>
                  <h2>{item.title}</h2>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {courseDetails ? (
            <>
              <div className="course-content-section1">
                <div>
                  {courseDetails.average_rating || "No rating"}{" "}
                  <GradeIcon sx={{ color: "orange" }} />
                </div>
              </div>
            </>
          ) : (
            <p>Loading course details...</p>
          )}
          <Reviews />
        </div>
      </div>
    </>
  );
};

export default CourseContent;
