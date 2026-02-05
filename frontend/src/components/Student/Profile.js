import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosconfig';
import Navbar from './../Home/NavBar.js';
import Footer from '../Home/Footer.js';
import { 
    Container, 
    Box, 
    Typography, 
    Paper, 
    Avatar, 
    Button, 
    Grid, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Alert,
    Stack,
    Divider
} from '@mui/material';
import { Edit, Lock, Person, Email, Save } from '@mui/icons-material';
import { useAuth } from '../../Context/auth';

const UserProfile = () => {
  const [auth] = useAuth();
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

  const handleSubmitNameChange = async () => {
    try {
      await axiosInstance.put('/auth/profile', userProfile);
      setSuccess('Name updated successfully!');
      setIsEditingName(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error updating name');
      setTimeout(() => setError(''), 3000);
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

  const handleChangePassword = async () => {
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
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response ? err.response.data.message : 'Error changing password');
    }
  };

  return (
   <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
   <Navbar />
   
   <Container maxWidth="md" sx={{ flexGrow: 1, py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: '#A435F0', fontSize: '2.5rem', mb: 2, fontWeight: 'bold' }}>
                  {userProfile.full_name?.charAt(0) || "U"}
              </Avatar>
              <Typography variant="h4" fontWeight="700" fontFamily="Inter" gutterBottom>
                  {userProfile.full_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" fontFamily="Inter">
                  {userProfile.email}
              </Typography>
          </Box>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {passwordSuccess && <Alert severity="success" sx={{ mb: 3 }}>{passwordSuccess}</Alert>}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="600" fontFamily="Inter" gutterBottom sx={{ mb: 3 }}>
              Account Settings
          </Typography>

          <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                  <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<Edit />} 
                      onClick={() => setIsEditingName(true)}
                      sx={{ 
                          py: 1.5, 
                          justifyContent: 'flex-start', 
                          color: '#334155', 
                          borderColor: '#CBD5E1',
                          textTransform: 'none',
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          '&:hover': { bgcolor: '#F1F5F9', borderColor: '#94A3B8' }
                      }}
                  >
                      Edit Profile Information
                  </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                   <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<Lock />} 
                      onClick={() => setIsEditingPassword(true)}
                      sx={{ 
                          py: 1.5, 
                          justifyContent: 'flex-start', 
                          color: '#334155', 
                          borderColor: '#CBD5E1',
                          textTransform: 'none',
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          '&:hover': { bgcolor: '#F1F5F9', borderColor: '#94A3B8' }
                      }}
                  >
                      Change Password
                  </Button>
              </Grid>
          </Grid>
      </Paper>
   </Container>

   {/* Edit Name Dialog */}
   <Dialog open={isEditingName} onClose={() => setIsEditingName(false)} maxWidth="sm" fullWidth>
       <DialogTitle sx={{ fontFamily: "Inter", fontWeight: 700 }}>Edit Profile</DialogTitle>
       <DialogContent>
           <Box sx={{ mt: 1 }}>
               <TextField
                   label="Full Name"
                   fullWidth
                   variant="outlined"
                   name="full_name"
                   value={userProfile.full_name}
                   onChange={handleChange}
                   InputProps={{ sx: { fontFamily: "Inter" } }}
                   InputLabelProps={{ sx: { fontFamily: "Inter" } }}
               />
           </Box>
       </DialogContent>
       <DialogActions sx={{ p: 2 }}>
           <Button onClick={() => setIsEditingName(false)} sx={{ fontFamily: "Inter", color: "#64748B" }}>Cancel</Button>
           <Button onClick={handleSubmitNameChange} variant="contained" startIcon={<Save />} sx={{ bgcolor: "#0F172A", fontFamily: "Inter" }}>Save Changes</Button>
       </DialogActions>
   </Dialog>

   {/* Change Password Dialog */}
   <Dialog open={isEditingPassword} onClose={() => setIsEditingPassword(false)} maxWidth="sm" fullWidth>
       <DialogTitle sx={{ fontFamily: "Inter", fontWeight: 700 }}>Change Password</DialogTitle>
       <DialogContent>
           {passwordError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{passwordError}</Alert>}
           <Stack spacing={3} sx={{ mt: 1 }}>
               <TextField
                   label="Current Password"
                   type="password"
                   fullWidth
                   variant="outlined"
                   value={oldPassword}
                   onChange={(e) => setOldPassword(e.target.value)}
                   InputProps={{ sx: { fontFamily: "Inter" } }}
                   InputLabelProps={{ sx: { fontFamily: "Inter" } }}
               />
               <TextField
                   label="New Password"
                   type="password"
                   fullWidth
                   variant="outlined"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   helperText="Must comprise 8 characters including uppercase, lowercase, numbers, and symbols."
                   InputProps={{ sx: { fontFamily: "Inter" } }}
                   InputLabelProps={{ sx: { fontFamily: "Inter" } }}
                   FormHelperTextProps={{ sx: { fontFamily: "Inter" } }}
               />
           </Stack>
       </DialogContent>
       <DialogActions sx={{ p: 2 }}>
           <Button onClick={() => setIsEditingPassword(false)} sx={{ fontFamily: "Inter", color: "#64748B" }}>Cancel</Button>
           <Button onClick={handleChangePassword} variant="contained" startIcon={<Save />} sx={{ bgcolor: "#0F172A", fontFamily: "Inter" }}>Update Password</Button>
       </DialogActions>
   </Dialog>

   <Footer />
   </Box>
  );
};

export default UserProfile;
