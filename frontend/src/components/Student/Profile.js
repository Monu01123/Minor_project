import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosconfig';
import "./student.css";
// import Navbar from './../Home/NavBar.js';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
  });
  const [isEditingName, setIsEditingName] = useState(false); 
  const [isEditingPassword, setIsEditingPassword] = useState(false); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUserProfile(response.data);
      } catch (err) {
        setError('Error fetching user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmitNameChange = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/auth/profile', userProfile);
      setSuccess('Name updated successfully!');
      setIsEditingName(false);
    } catch (err) {
      setError('Error updating name');
    }
  };

  const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars && isLongEnough;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordStrength(newPassword)) {
      setPasswordError('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/change-password', {
        email: userProfile.email,
        oldPassword,
        newPassword,
      });
      setPasswordSuccess(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setPasswordError('');
      setIsEditingPassword(false);
    } catch (err) {
      setPasswordError(err.response ? err.response.data.message : 'Error changing password');
    }
  };

  return (
   <>
   {/* <Navbar /> */}
   <div className='Profile-container'>
      <h2>{userProfile.full_name}</h2>
      <p>{userProfile.email}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button onClick={() => setIsEditingName(true)}>Change Name</button>
      <button onClick={() => setIsEditingPassword(true)}>Change Password</button>

      {isEditingName && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Name</h2>
            <form onSubmit={handleSubmitNameChange}>
              <div>
                <label>
                  Full Name:
                  <input
                    type="text"
                    name="full_name"
                    value={userProfile.full_name}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='button-collection'>
              <button type="submit" className='firstbtn'>Save</button>
              <button type="button" onClick={() => setIsEditingName(false)}>
                Cancel
              </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingPassword && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Password</h2>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            {passwordSuccess && <p style={{ color: 'green' }}>{passwordSuccess}</p>}
            <form onSubmit={handleChangePassword}>
              <div>
                <label>
                  Old Password:
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  New Password:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className='button-collection'>
              <button type="submit" className='firstbtn'>Change Password</button>
              <button type="button" onClick={() => setIsEditingPassword(false)}>
                Cancel
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
   </>
  );
};

export default UserProfile;
