import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import { cleanExpiredUsers } from "./utils/cleanExpiredUsers.js";
import customerRoute from "./routes/customerRoute.js";
import fieldRoute from "./routes/fieldRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import cron from "node-cron";

// ----------------------------------------------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/customers", customerRoute);
app.use("/api/fields", fieldRoute);
app.use("/api/services", serviceRoute);

// ------------------------------------------------

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

cron.schedule("*/1 * * * *", () => {
  cleanExpiredUsers();
});

// fields         Field[]
//   bookings       Booking[]
//   reviews        Review[]
//   notifications  Notification[]
//   chatbotLogs    ChatbotLog[]
//   matches        Match[]
//   participants   MatchParticipant[]
//   timeHolds      TimeHold[]
