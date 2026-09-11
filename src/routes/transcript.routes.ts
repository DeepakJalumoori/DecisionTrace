import { Router } from "express";
import authorizeTeam from "../middleware/authorizeTeam";
import { createTranscript } from "../controllers/transcript.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, authorizeTeam("member"), createTranscript);

export default router;
