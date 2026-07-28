import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, statsCustomer } from "../controllers/customerController.js";
import {requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/stats", statsCustomer);
router.get("/:id", getCustomerById);
router.post("/", requireAdmin, createCustomer);
router.put("/:id", requireAdmin, updateCustomer);
router.delete("/:id", requireAdmin, deleteCustomer);

export default router;
