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

router.get("/", protectedRoute, getAllReviews);
router.get("/field/:fieldId", protectedRoute, getFieldReviews);
router.get("/:reviewId", protectedRoute, getReviewById);
router.post("/", protectedRoute, createReview);
router.put("/:reviewId", protectedRoute, updateReview);
router.patch("/:reviewId/reply", protectedRoute, requireAdmin, replyReview);
router.delete("/:reviewId", protectedRoute, deleteReview);
export default router;
