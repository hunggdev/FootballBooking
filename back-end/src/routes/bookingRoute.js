import express from "express";
import {
  getSlots,
  holdSlot,
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  bookingHistory,
  deleteSlotHold,
  getMyHolds,
  getSlotStatusRange,
} from "../controllers/bookingController.js";
import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/slots", protectedRoute, getSlots);
router.get("/myHolds", protectedRoute, getMyHolds);
router.get("/statusRange", protectedRoute, getSlotStatusRange); 
router.post("/hold", protectedRoute, holdSlot);
router.delete("/hold", protectedRoute, deleteSlotHold);
router.post("/", protectedRoute, createBooking);
router.get("/history/me", protectedRoute, bookingHistory);
router.get("/", protectedRoute, requireAdmin, getBookings);
router.get("/:id", protectedRoute, getBookingById);
router.put("/:id", protectedRoute, requireAdmin, updateBooking);
router.put("/:id/cancel", protectedRoute, cancelBooking);


export default router;
