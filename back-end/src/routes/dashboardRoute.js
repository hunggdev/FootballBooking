import express from "express";

import {
  getOverviewStats,
  getChartStats,
  getRecentStats,
} from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/overview", getOverviewStats);
router.get("/chart", getChartStats);
router.get("/recent", getRecentStats);
export default router;
