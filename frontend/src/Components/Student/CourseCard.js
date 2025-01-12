import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { Link } from "react-router-dom";
import "./student.css";

const CourseCard = ({ course, userId }) => {
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState(""); 
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [existingReview, setExistingReview] = useState(null); 

  useEffect(() => {
    const fetchEnrollmentCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/courses/${course.course_id}/enrollment-count`
        );
        setEnrollmentCount(response.data.enrollmentCount);
      } catch (err) {
        console.error("Error fetching enrollment count:", err);
      }
    };

    const fetchExistingReview = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/reviews/course/${course.course_id}/user/${userId}`
        );
        if (response.data.length > 0) {
          setExistingReview(response.data[0]); 
          setReviewSubmitted(true); 
        }
      } catch (err) {
        console.error("Error fetching existing review:", err);
      }
    };

    fetchEnrollmentCount();
    fetchExistingReview();
  }, [course.course_id, userId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axiosInstance.post("/api/reviews", {
        user_id: userId,
        course_id: course.course_id,
        rating,
        comment,
      });
      
      setReviewSubmitted(true); 
      setExistingReview({ rating, comment }); 
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="course-card enrollment-card">
      <Link
        key={course.enrollment_id}
        to={`/courses/${course.course_id}`} 
        className="enrollment-card-link"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={course.image_url}
          alt={course.title}
          className="course-image"
        />
        <h4>{course.title.length > 24 ? `${course.title.substring(0, 24)}...` : course.title}</h4>
        <p>Enrollments: {enrollmentCount}</p>
        <button>Go to Course</button>
      </Link>
   
      {existingReview ? (
          <></>
      ) : (
        <form onSubmit={handleReviewSubmit} className="review-form">
          <label>
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
          </label>
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment"
            />
          </label>
          <button type="submit">Submit Review</button>
        </form>
      )}
      {/* {reviewSubmitted && <p>Review submitted successfully!</p>} Show success message */}
    </div>
  );
};

export default CourseCard;
