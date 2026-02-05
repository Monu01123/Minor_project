import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  MenuItem,
  Link,
  useTheme,
  useMediaQuery,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  School,
  Visibility,
  VisibilityOff,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Home/NavBar";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special char."
      );
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD:frontend/src/components/auth/Register.jsx
      await axios.post("http://localhost:8080/auth/register", {
=======
      const response = await axios.post("https://minor-project-3-18lw.onrender.com/auth/register", {
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/auth/Register.jsx
        full_name,
        email,
        password,
        role,
      });
      setStep(2);
      setSuccessMessage("Registration successful! Email sent for verification.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during registration."
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
<<<<<<< HEAD:frontend/src/components/auth/Register.jsx
      await axios.post("http://localhost:8080/auth/verify-otp", {
        email,
        otp: otpValue,
      });
=======
      const response = await axios.post(
        "https://minor-project-3-18lw.onrender.com/auth/verify-otp",
        {
          email,
          otp: otpValue,
        }
      );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/auth/Register.jsx
      setSuccessMessage("OTP verified successfully! Registration complete.");
      setTimeout(() => navigate("/login"), 1500); // Small delay to show success
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
    if (step === 2 && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer, step]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            component={Paper}
            elevation={6}
            sx={{ borderRadius: 4, overflow: "hidden" }}
          >
            {/* Left Side - Inspirational/Brand */}
            {!isMobile && (
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Matching Login Purple Gradient
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 4,
                  position: "relative",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Join Us Today!
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
                    "The expert in anything was once a beginner. Start your
                    learning journey now."
                  </Typography>
                  <Box
                    mt={4}
                    component="img"
                    src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg?w=740&t=st=1706699123~exp=1706699723~hmac=56456012356565" // Replace with a local asset if preferred
                    alt="Register"
                    sx={{ width: "80%", borderRadius: 2, boxShadow: 3 }}
                  />
                </motion.div>
              </Grid>
            )}

            {/* Right Side - Form */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                bgcolor: "background.paper",
              }}
            >
              <Box maxWidth="sm" width="100%">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ mb: 3, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          color="primary"
                          gutterBottom
                        >
                          Create Account
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Fill in your details to get started
                        </Typography>
                      </Box>

                      <form onSubmit={handleRegister}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          variant="outlined"
                          margin="normal"
                          value={full_name}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          variant="outlined"
                          margin="normal"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          variant="outlined"
                          margin="normal"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          select
                          fullWidth
                          label="I want to be a"
                          variant="outlined"
                          margin="normal"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <School color="action" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="instructor">Instructor</MenuItem>
                        </TextField>

                        {errorMessage && (
                          <Typography
                            color="error"
                            variant="body2"
                            sx={{ mt: 1, mb: 1 }}
                          >
                            {errorMessage}
                          </Typography>
                        )}

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          endIcon={
                            loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <ArrowForward />
                            )
                          }
                          sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            background:
                              "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", // Matching Login Purple Gradient
                            boxShadow: "0 4px 14px 0 rgba(118, 75, 162, 0.39)", // Matching Login Shadow
                            "&:hover": {
                              boxShadow: "0 6px 20px 0 rgba(118, 75, 162, 0.23)",
                            },
                          }}
                        >
                          {loading ? "Registering..." : "Register"}
                        </Button>

                        <Box mt={3} textAlign="center">
                          <Typography variant="body2" color="textSecondary">
                            Already have an account?{" "}
                            <Link
                              component="button"
                              variant="body2"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                              }}
                              sx={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              Log In
                            </Link>
                          </Typography>
                        </Box>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ mb: 4, textAlign: "center" }}>
                        <CheckCircle
                          color="success"
                          sx={{ fontSize: 60, mb: 2 }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          color="primary"
                          gutterBottom
                        >
                          Verify Email
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Enter the 6-digit code sent to {email}
                        </Typography>
                      </Box>

                      <form onSubmit={handleOtpVerify}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            mb: 3,
                          }}
                        >
                          {otp.map((value, index) => (
                            <TextField
                              key={index}
                              inputRef={inputRefs.current[index]}
                              value={value}
                              onChange={(e) => handleChange(e, index)}
                              onKeyDown={(e) => handleBackspace(e, index)}
                              variant="outlined"
                              inputProps={{
                                maxLength: 1,
                                style: {
                                  textAlign: "center",
                                  fontSize: "1.5rem",
                                  padding: "10px",
                                  width: "20px",
                                },
                              }}
                            />
                          ))}
                        </Box>

                        <Box textAlign="center" mb={2}>
                          {resendTimer > 0 ? (
                            <Typography variant="body2" color="textSecondary">
                              Resend code in 00:
                              {resendTimer < 10
                                ? `0${resendTimer}`
                                : resendTimer}
                            </Typography>
                          ) : (
                            <Button
                              onClick={() => setResendTimer(30)}
                              variant="text"
                              size="small"
                            >
                              Resend Code
                            </Button>
                          )}
                        </Box>

                        {errorMessage && (
                          <Typography
                            color="error"
                            variant="body2"
                            align="center"
                            sx={{ mb: 2 }}
                          >
                            {errorMessage}
                          </Typography>
                        )}
                         {successMessage && (
                          <Typography
                            color="success.main"
                            variant="body2"
                            align="center"
                            sx={{ mb: 2 }}
                          >
                            {successMessage}
                          </Typography>
                        )}


                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            background:
                              "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", // Matching Purple Gradient
                          }}
                        >
                          {loading ? "Verifying..." : "Verify & Login"}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Register;
