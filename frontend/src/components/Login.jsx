import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/flogo.png';
import loginPhoto from '../assets/loginphoto4.jpg';
import { useDispatch } from 'react-redux';
import { toggleLoginPage } from '../utils/slices/appSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(toggleLoginPage());

    return () => {
      dispatch(toggleLoginPage());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      // Assuming the API response has a status indicating success
      if (response.status === 200) {
        navigate('/'); // Redirect to home page
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Invalid email or password, please try again.'
      );
    }
  };

  return (
    <div className='flex p-4'>
      <div className='w-2/4'>
        <img src={loginPhoto} className='w-full' alt="" />
      </div>
      <div className='w-full'>
        <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-700 to-gray-900 p-2">
          <div className='flex'>
            <img src={logo} alt="Study With Me Logo" className="w-40 mb-2 " />
            <Link to='/'>
              <button className="text-black text-xl rounded-full p-1 relative left-64 cursor-pointer">
                ❌
              </button>
            </Link>
          </div>
          <div className="bg-white shadow-2xl rounded-lg p-4 max-w-md w-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Log In to <span className='font-bold text-2xl'>Study With Me</span>
              </h2>

              <form onSubmit={handleLogin}>
                <div className="mb-2">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-right mb-2">
                  <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</Link>
                </div>

                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                >
                  Log In
                </button>
              </form>
            </div>

            <div className="text-center text-gray-600 text-xs mt-4">
              &copy; {new Date().getFullYear()} Study With Me. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
