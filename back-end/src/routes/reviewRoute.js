import express from "express";

import {
  createReview,
  getAllReviews,
  getFieldReviews,
  getReviewById,
  updateReview,
  replyReview,
  deleteReview,
} from "../controllers/reviewController.js";

import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/field/:fieldId", getFieldReviews);

router.use(protectedRoute);

router.get("/:reviewId", getReviewById);
router.post("/", createReview);
router.put("/:reviewId", updateReview);
router.patch("/:reviewId/reply", requireAdmin, replyReview);
router.delete("/:reviewId", protectedRoute, deleteReview);
export default router;
