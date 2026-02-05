import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { AuthProvider } from "../Context/auth.js";
import { CartProvider } from "../components/Home/CartContext.js";
import { WishlistProvider } from "../components/Home/WishlistContext.js";
import { AboutUs } from "../components/Home/Footer.js";
import { PageSkeleton } from "../components/common/SkeletonLoader.js";

// Lazy Loaded Components
const HomePage = lazy(() => import("../components/Home/HomePage.js"));
const Login = lazy(() => import("../components/auth/Login.jsx"));
const Register = lazy(() => import("../components/auth/Register.jsx"));
const ForgotPasswordPage = lazy(() => import("../components/auth/ForgotPasswordPage.js"));
const ResetPasswordPage = lazy(() => import("../components/auth/ResetPasswordPage.js"));
const CourseList = lazy(() => import("../components/Home/CourseList.js"));
const Reviews = lazy(() => import("../components/Home/Reviews.js"));
const CourseContent = lazy(() => import("../components/Home/CourseContent.js"));
const CategoryManagement = lazy(() => import("../components/admin/CategoryManagement.js"));
const CourseManager = lazy(() => import("../components/instructor/CourseManager.js"));
const ManageCourseContent = lazy(() => import("../components/instructor/ManageCourseContent.js"));
const Cart = lazy(() => import("../components/Home/Cart.js"));
const Wishlist = lazy(() => import("../components/Home/Wishlist.js"));
const StudentDashboard = lazy(() => import("../components/Student/StudentDashboard.js"));
const CourseContentPage = lazy(() => import("../components/Student/CourseContentPage.js"));
const InstructorRoute = lazy(() => import("../components/instructor/InstructorRoute.js"));
const InstructorCourseReviewsPage = lazy(() => import("../components/instructor/InstructorReviewpage.js"));
const Profile = lazy(() => import("../components/Student/Profile.js"));
const User = lazy(() => import("../components/Student/StudentRoute.js"));


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="*" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/category/:categoryId" element={<CourseList />} />
              <Route path="/courses/:courseId" element={<CourseContent />} />
              <Route path="/courses/:courseId/reviews" element={<Reviews />} />
              <Route
                path="/profile"
                element={
                  <User>
                    <Profile />
                  </User>
                }
              />
              <Route path="/about" element={<AboutUs />} />
              <Route
                path="/student-dashboard"
                element={
                  <User>
                    <StudentDashboard />
                  </User>
                }
              />
              <Route
                path="/courses-content/:courseId"
                element={<CourseContentPage />}
              />
              <Route
                path="/cart"
                element={
                  <User>
                    <Cart />
                  </User>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <User>
                    <Wishlist />
                  </User>
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
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
