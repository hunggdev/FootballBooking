import express from "express";

import {
  generateInvoice,
  getInvoices,
  getInvoiceById,
} from "../controllers/invoiceController.js";

import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protectedRoute, requireAdmin, getInvoices);

router.get("/:invoiceId", protectedRoute, getInvoiceById);

router.post(
  "/generate/:bookingId",
  protectedRoute,
  requireAdmin,
  generateInvoice,
);

export default router;
