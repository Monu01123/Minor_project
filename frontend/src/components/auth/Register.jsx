import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../Home/logo.png";
import Navbar from "../Home/NavBar";

const Register = () => {
  const navigate = useNavigate();
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = Array(6)
      .fill(null)
      .map(() => React.createRef());
  }, []);

  const isStrongPassword = (password) => {
    const minLength = 6;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return password.length >= minLength && regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        full_name,
        email,
        password,
        role,
      });
      setStep(2);
      setSuccessMessage(
        "Registration successful! Email sent for verification."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const otpValue = otp.join("");

    setLoading(true); 

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/verify-otp",
        {
          email,
          otp: otpValue,
        }
      );
      setSuccessMessage("OTP verified successfully! Registration complete.");
      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid OTP, please try again."
      );
    } finally {
      setLoading(false); 
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].current.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].current.focus();
      }
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const navigateToregister = () => {
    navigate("/login");
  };

  return (
    <>
    <Navbar/>
      <div className="main_register">
      {step === 1 ? (
        <form onSubmit={handleRegister} className="register_form">
          <img src={logo} alt="logo" className="register_promo" />
          <h1>Register</h1>
          <input
            type="text"
            placeholder="Full Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          <button disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <p className="forgot">
            Already have an account?{" "}
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
              Log in
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOtpVerify} className="otp-section">
          <div>
            <label className="OTP_text">Verify with OTP</label>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  ref={inputRefs.current[index]}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            {resendTimer > 0 ? (
              <p>
                Resend OTP in:{" "}
                <strong>
                  00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                </strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setResendTimer(30)}
                className="resent_btn"
              >
                Resend OTP
              </button>
            )}
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && (
            <p style={{ color: "green", margin: "5px" }}>{successMessage}</p>
          )}
          <button type="submit" className="registerbtn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
    </div>
    </>
  );
};

export default Register;
