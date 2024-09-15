import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
import { testConnection } from "./db.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoute from "./routes/categoryRoute.js";
import courseRoutes from "./routes/courseRoute.js";
import contentRoutes from "./routes/contentRoute.js"; // Import content routes
import reviewRoutes from "./routes/reviewRoute.js"; 
import enrollmentRoutes from "./routes/enrollmentRoute.js";
import wishlistRoutes from "./routes/wishlistRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If you need to send cookies or other credentials
}));

app.use(express.json());
app.use("/admin", authenticateToken, adminRoutes);
app.use("/auth", authRoutes);
app.use('/categories', categoryRoute);
app.use('/api', courseRoutes);
app.use('/api', contentRoutes); 
app.use('/api', enrollmentRoutes);
app.use('/api', reviewRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', cartRoutes); 
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await testConnection();
});
