import express from "express";
import { signUp, signIn, signOut, verifyEmail, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/signout", signOut)
router.get("/verify", verifyEmail)
router.post("/refresh", refreshToken)

export default router;
