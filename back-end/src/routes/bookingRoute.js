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
import { optionalAuth, protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/slots", optionalAuth, getSlots);
router.get("/statusRange", getSlotStatusRange);

router.use(protectedRoute);
router.get("/myHolds", getMyHolds);

router.post("/hold", holdSlot);
router.delete("/hold", deleteSlotHold);

router.post("/", createBooking);
router.get("/history/me", bookingHistory);
router.put("/:id/cancel", cancelBooking);

router.get("/", requireAdmin, getBookings);
router.put("/:id", requireAdmin, updateBooking);

router.get("/:id", getBookingById);


export default router;
