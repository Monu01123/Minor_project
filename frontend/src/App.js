import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home/HomePage.js";
import Login from "./Components/auth/Login.jsx";
import Register from "./Components/auth/Register.jsx";
import ForgotPasswordPage from "./Components/auth/ForgotPasswordPage.js";
import ResetPasswordPage from "./Components/auth/ResetPasswordPage.js";
import CourseList from "./Components/Home/CourseList.js";
import Reviews from "./Components/Home/Reviews.js";
import CourseContent from "./Components/Home/CourseContent.js";
import CategoryManagement from "./Components/instructor/CategoryManagement.js";
import Instructormenu from "./Components/instructor/CategoryMenu.js";
import CourseManager from "./Components/instructor/CourseManager.js";
import InstructorCourses from "./Components/instructor/Instructor_courses.js";
import ManageCourseContent from "./Components/instructor/ManageCourseContent.js";
import Cart from "./Components/Home/Cart.js";
import Wishlist from "./Components/Home/Wishlist.js";
import StudentDashboard from "./Components/Student/StudentDashboard.js";
import CourseContentPage from "./Components/Student/CourseContentPage.js";
import InstructorRoute from "./Components/instructor/InstructorRoute";
import { AuthProvider } from "./Context/auth.js";
import InstructorCourseReviewsPage from "./Components/instructor/InstructorReviewpage.js";
import Profile from "./Components/Student/Profile.js";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/category/:categoryId" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseContent />} />
        <Route path="/courses/:courseId/reviews" element={Reviews} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route
          path="/courses-content/:courseId"
          element={<CourseContentPage />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/instructor-dashboard"
          element={
            <InstructorRoute>
              <Instructormenu />
            </InstructorRoute>
          }
        />
        <Route
          path="/instructor-dashboard/category"
          element={
            <InstructorRoute>
              <CategoryManagement />
            </InstructorRoute>
          }
        />
        <Route
          path="/instructor-dashboard/course"
          element={
            <InstructorRoute>
              <CourseManager />
            </InstructorRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <InstructorRoute>
              <InstructorCourses />
            </InstructorRoute>
          }
        />
        <Route
          path="/instructor/course/:courseId/content"
          element={
            <InstructorRoute>
              <ManageCourseContent />
            </InstructorRoute>
          }
        />
        <Route
          path="/instructor/:instructorId/course/:courseId/reviews"
          element={<InstructorCourseReviewsPage />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
