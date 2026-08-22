import { prisma } from "../config/database.js";

import { getOverview, getChart, getRecent } from "../libs/adminDashboard.js";  

export const getOverviewStats = async (req, res) => {
  try {
    const { from, to } = req.query;

    const data = await getOverview({
      from,
      to,
    });

    return res.status(200).json({
      success: true,
      message: "Get dashboard statistics successfully",
      data,
    });
  } catch (error) {
    console.error("Error getting dashboard statistics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
      error: error.message,
    });
  }
};

export const getChartStats = async (req, res) => {
  try {
    const { from, to } = req.query;

    const data = await getChart({
      from,
      to,
    });

    return res.status(200).json({
      success: true,
      message: "Get dashboard statistics successfully",
      data,
    });
  } catch (error) {
    console.error("Error getting dashboard statistics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
      error: error.message,
    });
  }
};

export const getRecentStats = async (req, res) => {
  try {
    const { from, to } = req.query;

    const data = await getRecent({
      from,
      to,
    });

    return res.status(200).json({
      success: true,
      message: "Get dashboard statistics successfully",
      data,
    });
  } catch (error) {
    console.error("Error getting dashboard statistics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
      error: error.message,
    });
  }
};

