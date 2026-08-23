import express from "express";

import {
  getOverviewStats,
  getChartStats,
  getRecentStats,
} from "../controllers/dashboardController.js";
import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectedRoute, requireAdmin);

router.get("/overview", getOverviewStats);
router.get("/chart", getChartStats);
router.get("/recent", getRecentStats);
export default router;
