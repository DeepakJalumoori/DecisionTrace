import { Router } from "express";
import { createTeam, getTeams } from "../controllers/team.controller";

const router = Router();

router.post("/", createTeam);
router.get("/", getTeams);

export default router;
