import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { promisePool } from "../db.js"; // Import the database connection
import jwt from "jsonwebtoken";

const saltRounds = 10;
const resetTokenExpiresTime = 3600000;
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

const initiatePasswordReset = async (email) => {
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + resetTokenExpiresTime); // OTP expires in 1 hour

  const [result] = await promisePool.query(
    `UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?`,
    [otp, otpExpires, email]
  );

  if (result.affectedRows === 0) {
    throw new Error("User not found");
  }
  return otp;
};

// Add OTP generation and sending after user creation
const createUser = async ({ full_name, email, password, role }) => {
  const password_hash = await bcrypt.hash(password, saltRounds);
  const [result] = await promisePool.query(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [full_name, email, password_hash, role]
  );

  // Generate and send OTP
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + resetTokenExpiresTime);

  await promisePool.query(
    "UPDATE users SET otp = ?, otp_expires = ? WHERE user_id = ?",
    [otp, otpExpires, result.insertId]
  );

  await sendResetPasswordEmail(email, otp);

  return result.insertId;
};


const findUserByEmail = async (email) => {
  const [rows] = await promisePool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

const generateToken = (user) => {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyPassword = async (password, password_hash) => {
  return bcrypt.compare(password, password_hash);
};

// Send the reset password OTP via email
const sendResetPasswordEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset OTP",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please use the following OTP to reset your password:\n\n
           OTP: ${otp}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  await transporter.sendMail(mailOptions);
};

const resetPassword = async (email, otp, newPassword) => {
  const [rows] = await promisePool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  const user = rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otp_expires < Date.now()) {
    throw new Error("Expired OTP");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  await promisePool.query(
    `UPDATE users SET password_hash = ?, otp = NULL, otp_expires = NULL WHERE email = ?`,
    [newPasswordHash, email]
  );
};

export const authenticateToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // If no token is found

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If the token is no longer valid
    req.user = user; // Attach the user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// const saltRounds = 10;

const changePassword = async (userId, newPassword) => {
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
  await promisePool.query(
    `UPDATE users SET password_hash = ? WHERE user_id = ?`,
    [newPasswordHash, userId]
  );
};

const getUserProfile = async (userId) => {
  const [rows] = await promisePool.query(
      'SELECT user_id, full_name, email, role FROM users WHERE user_id = ?',
      [userId]
  );
  if (rows.length === 0) {
      throw new Error('User not found');
  }
  return rows[0];
};


// Function to update the user's profile
const updateUserProfile = async (userId, updatedProfile) => {
  const { full_name, email } = updatedProfile;

  // Ensure full_name and email are provided in the request body
  if (!full_name || !email) {
    throw new Error("Full name and email are required");
  }

  // Update the user's profile in the database
  const [result] = await promisePool.query(
    "UPDATE users SET full_name = ?, email = ? WHERE user_id = ?",
    [full_name, email, userId]
  );

  // Check if the update was successful
  if (result.affectedRows === 0) {
    throw new Error("Profile update failed");
  }
  return {
    user_id: userId,
    full_name,
    email,
  };
};

// Function to resend OTP
const resendOTP = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  // Generate new OTP and expiration time
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + resetTokenExpiresTime); // 1-hour expiration

  // Update the user record with the new OTP
  await promisePool.query(
    "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?",
    [otp, otpExpires, email]
  );

  // Send the new OTP via email
  await sendResetPasswordEmail(email, otp);

  return { message: "OTP has been resent" };
};


export {
  updateUserProfile,
  getUserProfile,
  verifyPassword,
  generateToken,
  initiatePasswordReset,
  sendResetPasswordEmail,
  resetPassword,
  createUser,
  findUserByEmail,
  changePassword,
  resendOTP,
};
