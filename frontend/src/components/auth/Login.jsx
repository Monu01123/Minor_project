import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../Home/logo.png";
import { useAuth } from "../../Context/auth.js";
import Navbar from "../Home/NavBar.js";
import axiosInstance from "../../axiosconfig.js";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      setAuth({
        ...auth,
        user: response.data.user,
        token: response.data.token,
      });

      localStorage.setItem("auth", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("Server error");
      }
    }
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const navigateToregister = () => {
    navigate("/register");
  };

  return (
    <>
    <Navbar/>
      <div className="main_register">
        <form onSubmit={handleLogin} className="register_form">
          <img src={logo} alt="logo" className="register_promo" />
          <h1>Let's Get Started</h1>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button type="submit">Login</button>
          <p className="forgot">
            or{" "}
            <button
              onClick={navigateToForgotPassword}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Forgot Password
            </button>
          </p>
          <p className="forgot">
            Don't have an account?{" "}
            <button
              onClick={navigateToregister}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
