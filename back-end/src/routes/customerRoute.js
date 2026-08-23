import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, statsCustomer } from "../controllers/customerController.js";
import {protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute, requireAdmin)

router.get("/", getCustomers);
router.get("/stats", statsCustomer);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
