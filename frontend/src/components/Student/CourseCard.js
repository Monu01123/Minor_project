import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import { Link } from "react-router-dom";

const CourseCard = ({ course, userId }) => {
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [rating, setRating] = useState(0); // For the rating input
  const [comment, setComment] = useState(""); // For the comment input
  const [reviewSubmitted, setReviewSubmitted] = useState(false); // To manage review submission state
  const [existingReview, setExistingReview] = useState(null); // To hold existing review

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
          setExistingReview(response.data[0]); // Assume the response returns an array of reviews
          setReviewSubmitted(true); // Set to true if a review exists
        }
      } catch (err) {
        console.error("Error fetching existing review:", err);
      }
    };

    fetchEnrollmentCount();
    fetchExistingReview();
  }, [course.course_id, userId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      const response = await axiosInstance.post("/api/reviews", {
        user_id: userId,
        course_id: course.course_id,
        rating,
        comment,
      });
      console.log(response.data); // Handle response as needed
      setReviewSubmitted(true); // Set review submitted state
      setExistingReview({ rating, comment }); // Update existingReview state
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="course-card">
      <Link
        key={course.enrollment_id}
        to={`/courses/${course.course_id}`} // Use course_id here for redirection
        className="view-course-button"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={course.image_url}
          alt={course.title}
          style={{ width: "100px", height: "100px" }}
        />
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <p>Enrollments: {enrollmentCount}</p>
        <button>Go to Course</button>
      </Link>

      {/* Review Section */}
      {existingReview ? (
        <div>
          {/* <h4>Your Review:</h4>
          <p>Rating: {existingReview.rating}</p>
          <p>Comment: {existingReview.comment}</p> */}
          <></>
        </div>
      ) : (
        <form onSubmit={handleReviewSubmit}>
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
