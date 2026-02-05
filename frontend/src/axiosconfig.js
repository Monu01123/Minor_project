import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
=======
  baseURL: 'https://minor-project-3-18lw.onrender.com',
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610
});

// Automatically add the token to all requests if it exists in localStorage
axiosInstance.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});
// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear local storage and redirect to login
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
