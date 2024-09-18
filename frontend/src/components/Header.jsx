import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import logo from '../assets/flogo.png';
import searchIcon from '../assets/search2.png';
import userImg from '../assets/userImg.png';
import globe from '../assets/globe.png';

const Header = () => {
  // Select both login and signup states from Redux store
  const isLogin = useSelector((store) => store.app.loginPage);
  const isSignUp = useSelector((store) => store.app.signUpPage);

  return (
    <div className='max-w-screen-xl mx-auto bg-gradient-to-r from-blue-700 to-gray-900 rounded-lg p-1 flex items-center mt-1'>
      <div>
        <Link to='/'>
          <img src={logo} className='w-32' alt="Study With Me" />
        </Link>
      </div>
      <div className='flex w-6/12 p-2'>
        <input type="text" className='w-full rounded-l-xl px-2' placeholder='Search...' />
        <img src={searchIcon} className='bg-white w-8 h-9 p-2 rounded-r-xl' alt="Search Icon" />
      </div>
      <div>
        {/* Use Font Awesome cart icon */}
        <FaShoppingCart className='text-white w-6 h-6 mx-12' alt="Cart Icon" />
      </div>
      <div className='flex space-x-2'>
        {
          isLogin ? (
            <Link to='/'>
              <button className='flex items-center px-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700'>
                Cancel
              </button>
            </Link>
          ) : (
            <Link to='/login'>
              <button className='flex items-center px-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700'>
                Sign In
              </button>
            </Link>
          )
        }
        {
          isSignUp ? (
            <Link to='/'>
              <button className='flex items-center px-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'>
                Cancel
              </button>
            </Link>
          ) : (
            <Link to='/signup'>
              <button className='flex items-center px-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'>
                Sign Up
              </button>
            </Link>
          )
        }
      </div>
      <div>
        <img src={userImg} className='w-8 rounded-full m-4' alt="User Icon" />
      </div>
      <div>
        <img src={globe} className='w-10' alt="Globe Icon" />
      </div>
    </div>
  );
};

export default Header;
