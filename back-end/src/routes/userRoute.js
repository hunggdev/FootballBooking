import express from 'express'
import { authMe, update, changePassword, chatbot } from '../controllers/userController.js';

const router = express.Router();

router.get("/me", authMe);
router.patch("/update", update);
router.patch("/change-password", changePassword)
router.post("/chatbot", chatbot);


export default router;