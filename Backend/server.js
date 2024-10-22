import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
import { testConnection } from "./db.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoute from "./routes/categoryRoute.js";
import courseRoutes from "./routes/courseRoute.js";
import contentRoutes from "./routes/contentRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import enrollmentRoutes from "./routes/enrollmentRoute.js";
import wishlistRoutes from "./routes/wishlistRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { promisePool } from "./db.js";
import uploadRouter from "./routes/uploadRoute.js";
// import { serialize } from "mongodb";
import { clearCart } from "./Controllers/cartController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const stripe = new Stripe(
  "sk_test_51MiCn5SCTwSZDv2RR3oDVEXTMMCoBlPVw38fMQnU8t1yytD2kA8UkD5sXgYOot40xweJJ4gpvZcmk1KfdppRoEF20068llVjAn"
);
const endpointSecret =
  "whsec_33ae706467f90cf174362f72279bd9390d6985b79563baafd845100157491711";

// Ensure the webhook route is defined before body-parser middleware
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Webhook received session:", session);
      const userId = session.metadata.userId;
      const courseIds = session.metadata.courseIds;

      console.log("Received Course IDs:", courseIds);
      console.log("User ID:", userId);

      if (courseIds) {
        const courseIdArray = courseIds.split(",").filter(Boolean);
        try {
          for (const courseId of courseIdArray) {
            await enrollUserInCourse(userId, courseId);
            console.log(`User ${userId} successfully enrolled in course ${courseId}`);
          }

          // Clear the user's cart after successful payment
          await clearCart(userId); // Pass only the userId
          console.log(`Cart cleared for user ${userId}`);

          res.status(200).send("User successfully enrolled in all courses and cart cleared");
        } catch (error) {
          console.error("Error enrolling user in courses or clearing cart:", error);
          res.status(500).send("Error enrolling user in courses or clearing cart");
        }
      } else {
        res.status(400).send("No course IDs found in metadata");
      }
    } else {
      res.status(400).end();
    }
  }
);


// Use the rest of the middleware and routes after the webhook
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/admin", authenticateToken, adminRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoute);
app.use("/api", courseRoutes);
app.use("/api", contentRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", reviewRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", cartRoutes);
app.use("/api/upload", uploadRouter);
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.post("/create-checkout-session", async (req, res) => {
  const { items, userId, courseIds } = req.body; // Ensure courseIds is destructured

  // Log the received items and courseIds
  console.log("Received items:", items);
  console.log("Course IDs:", courseIds);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      billing_address_collection: "required",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: { userId, courseIds }, // Pass courseIds here
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
});

async function enrollUserInCourse(userId, courseId) {
  try {
    const query = "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";
    await promisePool.execute(query, [userId, courseId]);
    console.log(`User ${userId} enrolled in course ${courseId}`);
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
}

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await testConnection();
});
