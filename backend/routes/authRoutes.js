import express from "express";
import { body, validationResult } from "express-validator";
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  generateToken,
  initiatePasswordReset,
  sendResetPasswordEmail,
  resetPassword,
  authenticateToken,
  getUserProfile,
  updateUserProfile,
  resendOTP,
  hashPassword,
  updatePassword,
} from "../Controllers/userController.js";
import { promisePool } from "../db.js";

const router = express.Router();

router.post(
  "/register",
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["student", "instructor", "admin"])
    .withMessage("Invalid role"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, email, password, role } = req.body;

    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already registered" });
      }

      const userId = await createUser({ full_name, email, password, role });
      res.status(201).json({ message: "User registered successfully", userId });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// Inside your login route
router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await findUserByEmail(email);
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.is_active) {
        return res.status(403).json({ message: "Email not verified" });
      }

      const token = generateToken(user); // Generates JWT token

      // Modify the response to include the user details along with the token
      res.json({
        token,
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userProfile = await getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Invalid email address"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const resetToken = await initiatePasswordReset(email);
      await sendResetPasswordEmail(email, resetToken);
      res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/reset-password",
  body("email").isEmail().withMessage("Invalid email address"),
  body("token").notEmpty().withMessage("Token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, token, newPassword } = req.body;
    try {
      await resetPassword(email, token, newPassword);
      res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }
);

router.post(
  "/change-password",
  body("email").isEmail().withMessage("Invalid email address"),
  body("oldPassword")
    .isLength({ min: 6 })
    .withMessage("Old password must be at least 6 characters long"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, oldPassword, newPassword } = req.body;
    console.log("Request Body:", req.body); // Log full request body
    console.log("Extracted Email:", email); // Log extracted email
    console.log("Old Password:", oldPassword); // Log old password
    console.log("New Password:", newPassword); // Log new password

    try {
      const user = await findUserByEmail(email);
      console.log("User Found:", user);  // Log the found user

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isOldPasswordValid = await verifyPassword(oldPassword, user.password_hash);
      console.log("Is Old Password Valid:", isOldPasswordValid);  // Log password verification result

      if (!isOldPasswordValid) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      console.log("Hashed New Password:", hashedNewPassword);  // Log the new hashed password

      await updatePassword(user.user_id, hashedNewPassword);

      res.json({ message: "Password changed successfully" });
    } catch (err) {
      console.error("Error:", err); // Log the error
      res.status(500).send("Server Error");
    }
  }
);


router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userProfile = await getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const updatedProfile = req.body;
    await updateUserProfile(userId, updatedProfile);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/become-instructor", authenticateToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [user] = await promisePool.query(
      "SELECT role FROM users WHERE user_id = ?",
      [userId]
    );

    if (!user[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentRole = user[0].role;

    if (currentRole === "instructor") {
      return res.status(400).json({ message: "You are already an instructor" });
    }

    await promisePool.query(
      "UPDATE users SET role = 'instructor' WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({ message: "You are now an instructor!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post(
  "/verify-otp",
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp").notEmpty().withMessage("OTP is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    try {
      const [rows] = await promisePool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      const user = rows[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (user.otp_expires < Date.now()) {
        return res.status(400).json({ message: "Expired OTP" });
      }

      await promisePool.query(
        "UPDATE users SET otp = NULL, otp_expires = NULL,is_active = TRUE WHERE email = ?",
        [email]
      );

      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await resendOTP(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
