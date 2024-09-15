import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.avif";
import signupPhoto from "../assets/loginphoto4.jpg";
import axios from "axios";

const SignUp = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    setSuccessMessage(""); 

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formData
      );
      setStep(2);
      setSuccessMessage("Registration successful! Email sent for verification.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/verify-otp",
        {
          email: formData.email,
          otp,
        }
      );
      setSuccessMessage("OTP verified successfully! Registration complete.");
    //   alert("OTP verified successfully. You can now log in.");
      navigate('/');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid OTP, please try again."
      );
    }
  };

  return (
    <div className="flex p-4">
      <div className="w-2/4">
        <img src={signupPhoto} className="w-full" alt="Sign Up" />
      </div>
      <div className="w-full">
        <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-700 to-gray-900 p-2">
          <div className="flex">
            <img src={logo} alt="Study With Me Logo" className="w-40 mb-2" />
            <Link to="/">
              <button className="text-black text-xl rounded-full p-1 relative left-64 cursor-pointer">
                ❌
              </button>
            </Link>
          </div>
          <div className="bg-white shadow-2xl rounded-lg p-4 max-w-md w-full flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Sign Up for{" "}
              <span className="font-bold text-2xl">Study With Me</span>
            </h2>
            {step === 1 ? (
              <form onSubmit={handleRegister}>
                <div className="mb-2">
                  <label className="block text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Role</label>
                  <select
                    name="role"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
                <div className="mb-2">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms" className="text-sm text-gray-700 ml-2">
                    I accept the{" "}
                    <Link to="/terms" className="text-blue-500 hover:underline">
                      terms and conditions
                    </Link>
                  </label>
                </div>
                <button className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                  Sign Up
                </button>
              </form>
            ) : (
                <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
      
                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-green-600 text-center">{successMessage}</p>
                )}
      
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                  Verify OTP
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;