import express from "express";

import {
  generateInvoice,
  getInvoices,
  getInvoiceById,
} from "../controllers/invoiceController.js";

import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute, requireAdmin);

router.get("/", getInvoices);
router.get("/:invoiceId", getInvoiceById);
router.post("/generate/:bookingId", generateInvoice);

export default router;
