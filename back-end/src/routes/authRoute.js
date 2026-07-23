import express from "express";
import { signUp, signIn, signOut, verifyEmail, refreshToken, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/signout", signOut)
router.get("/verify", verifyEmail)
router.post("/refresh", refreshToken)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router;
