import express from 'express'
import { authMe, update, changePassword } from '../controllers/userController.js';

const router = express.Router();

router.get("/me", authMe);
router.patch("/update", update);
router.patch("/change-password", changePassword)

export default router;