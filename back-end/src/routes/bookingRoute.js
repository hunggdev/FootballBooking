import express from "express";
import {
  searchSlots,
  holdSlot,
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  bookingHistory,
} from "../controllers/bookingController.js";
import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/slots", protectedRoute, searchSlots);
router.post("/hold", protectedRoute, holdSlot);
router.post("/", protectedRoute, createBooking);
router.get("/history/me", protectedRoute, bookingHistory);
router.get("/", protectedRoute, requireAdmin, getBookings);
router.get("/:id", protectedRoute, getBookingById);
router.put("/:id", protectedRoute, requireAdmin, updateBooking);
router.put("/:id/cancel", protectedRoute, cancelBooking);

export default router;
