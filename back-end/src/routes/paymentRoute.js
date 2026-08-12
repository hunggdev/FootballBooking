import express from "express";
import {
  createPaymentLink,
  handleWebhook,
} from "../controllers/paymentController.js";
const router = express.Router();

router.post("/create-payment-link", createPaymentLink);
router.post("/webhook", handleWebhook);

export default router;