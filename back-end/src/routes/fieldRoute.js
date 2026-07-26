import express from "express";
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", getFields);
router.get("/:id", getFieldById);
router.post("/", requireAdmin, createField);
router.put("/:id", requireAdmin, updateField);
router.delete("/:id", requireAdmin, deleteField);

export default router;
