import express from "express";
import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);

router.use(protectedRoute, requireAdmin);

router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
