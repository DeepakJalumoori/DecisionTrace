import { Router } from "express";
import { createTeam, getTeams } from "../controllers/team.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, getTeams);

export default router;
