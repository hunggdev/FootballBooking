import express from "express";
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";

import {
  getFieldSlots,
  createFieldSlot,
  updateFieldSlot,
  deleteFieldSlot,
} from "../controllers/fieldSlotController.js";

import { protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Field
router.get("/", getFields);
router.get("/:id", getFieldById);
router.get("/:id/slots", getFieldSlots);

router.use(protectedRoute);

router.post("/", requireAdmin, createField);
router.put("/:id", requireAdmin, updateField);
router.delete("/:id", requireAdmin, deleteField);

// FieldSlot
router.post("/:id/slots", requireAdmin, createFieldSlot);
router.put("/slots/:slotId", requireAdmin, updateFieldSlot);
router.delete("/slots/:slotId", requireAdmin, deleteFieldSlot);

export default router;
