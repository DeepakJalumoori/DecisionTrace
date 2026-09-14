import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import resolveDecision from "../controllers/decision.controller";

const router = Router();

router.patch("/:decisionId/resolve", authMiddleware, resolveDecision);

export default router;
