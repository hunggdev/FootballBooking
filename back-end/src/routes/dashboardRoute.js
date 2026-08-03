import express from "express";

import { getDashboard } from "../controllers/dashboardController.js";

import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protectedRoute, requireAdmin, getDashboard);

export default router;
