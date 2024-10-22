// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import logo from '../assets/flogo.png';
// import searchIcon from '../assets/search2.png';
// import { FaShoppingCart } from 'react-icons/fa';
// import globe from '../assets/globe.png';
// import { logout } from '../utils/slices/userSlice';  // Import the logout action
// import { Link } from 'react-router-dom';

// const Header = () => {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
//   const username = useSelector((store) => store.user.user?.username);  // Get username

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <div className='max-w-screen-xl mx-auto bg-[#002326] rounded-lg p-1 flex items-center mt-1'>
//       <div>
//         <Link to='/'>
//           <img src={logo} className='w-32' alt="Study With Me" />
//         </Link>
//       </div>
//       <div className='flex w-6/12 p-2 ml-8'>
//         <input type="text" className='w-full rounded-l-xl px-2' placeholder='Search...' />
//         <img src={searchIcon} className='bg-white w-8 h-9 p-2 rounded-r-xl' alt="Search Icon" />
//       </div>
//       <div>
//         {/* Use Font Awesome cart icon */}
//         <FaShoppingCart className='text-white w-6 h-6 mx-12' alt="Cart Icon" />
//       </div>
//       <div className='flex space-x-2'>
//         {
//           isAuthenticated ? (
//             <>
//               <p className="text-white mr-2">Hello,User {username}</p>
//               <button onClick={handleLogout} className='flex items-center px-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700'>
//                 Log Out
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to='/login'>
//                 <button className='flex items-center px-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700'>
//                   Log In
//                 </button>
//               </Link>
//               <Link to='/signup'>
//                 <button className='flex items-center px-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'>
//                   Sign Up
//                 </button>
//               </Link>
//             </>
//           )
//         }
//       </div>
//       <div>
//         <img src={globe} className='w-10 ml-4' alt="Globe Icon" />
//       </div>
//     </div>
//   );
// };

// export default Header;
