import express from "express";
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch, statsMatch, joinMatch, cancelJoinMatch } from "../controllers/matchController.js";
import { optionalAuth, protectedRoute, requireAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", optionalAuth, getMatches);
router.get("/stats", protectedRoute, requireAdmin, statsMatch);
router.get("/:id", optionalAuth, getMatchById);

router.use(protectedRoute); 

router.post("/", createMatch);
router.post("/:id/join", joinMatch);
router.delete("/:id/join", cancelJoinMatch);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch); 

export default router;
