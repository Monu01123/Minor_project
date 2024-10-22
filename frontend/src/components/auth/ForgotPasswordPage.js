import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./auth.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/auth/forgot-password', { email });
      setMessage(response.data.message);
      setErrorMessage('');
      setStep(2); 
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/reset-password', {
        email,
        token,
        newPassword,
      });
      setMessage(response.data.message);
      setErrorMessage('');
      navigate('/login'); 
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div className='forgot_password'>
      {step === 1 && (
        <div className='form1'>
          <h3>Forgot Password</h3>
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type='submit' disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          </form>
          {message && <p className='Smessage' >{message}</p>}
          {errorMessage && <p className='Emessage' >{errorMessage}</p>}
        </div>
      )}

      {step === 2 && (
        <div className='forgot_password'>
          <form onSubmit={handleResetPassword} className='form1'>
          <h3>Reset Password</h3>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <button type="submit">Reset Password</button>
            {message && <p className='Smessage'>{message}</p>}
          {errorMessage && <p  className='Emessage'>{errorMessage}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
