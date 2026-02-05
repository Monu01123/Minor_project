import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/auth.js";
import axiosInstance from "../../axiosconfig.js";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Navbar from "../Home/NavBar.js";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          <Grid container component={Paper} elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
            {/* Left Side - Inspirational/Brand */}
            {!isMobile && (
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                    Welcome Back!
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
                    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                  </Typography>
                  <Box mt={4} component="img" src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg?w=826&t=st=1706698946~exp=1706699546~hmac=6c74757088998897" alt="Learning" sx={{ width: "80%", borderRadius: 2, boxShadow: 3 }} />
                </motion.div>
              </Grid>
            )}

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4, bgcolor: "background.paper" }}>
              <Box maxWidth="sm" width="100%">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="700" color="primary" gutterBottom>
                      Sign In
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Access your courses and continue learning
                    </Typography>
                  </Box>

                  <form onSubmit={handleLogin}>
                    <TextField
                      fullWidth
                      label="Email Address"
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
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {errorMessage && (
                      <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
                        {errorMessage}
                      </Typography>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, mb: 3 }}>
                       {/* Placeholder for Remember Me if needed */}
                       <Box /> 
                      <Link
                        component="button"
                        variant="body2"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/forgot-password");
                        }}
                        underline="hover"
                        sx={{ fontWeight: 500 }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<LoginIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 4px 14px 0 rgba(118, 75, 162, 0.39)",
                        "&:hover": {
                          boxShadow: "0 6px 20px 0 rgba(118, 75, 162, 0.23)",
                        },
                      }}
                    >
                      Login
                    </Button>

                    <Box mt={3} textAlign="center">
                      <Typography variant="body2" color="textSecondary">
                        Don't have an account?{" "}
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/register");
                        }}
                          sx={{ fontWeight: "bold", cursor: "pointer" }}
                        >
                          Sign Up
                        </Link>
                      </Typography>
                    </Box>
                  </form>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Login;
