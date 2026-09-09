import { Router } from "express";
import {
  addTeamMember,
  createTeam,
  getTeams,
} from "../controllers/team.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, getTeams);
router.post("/:teamId/members", authMiddleware, addTeamMember);

export default router;
