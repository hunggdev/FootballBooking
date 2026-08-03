import express from "express";
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch, statsMatch, joinMatch, cancelJoinMatch } from "../controllers/matchController.js";

const router = express.Router();

router.get("/", getMatches);
router.get("/stats", statsMatch);
router.get("/:id", getMatchById);
router.post("/", createMatch);
router.post("/:id/join", joinMatch);
router.delete("/:id/join", cancelJoinMatch);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch); 

export default router;
