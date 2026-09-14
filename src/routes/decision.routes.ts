import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import resolveDecision, {
  getDecisionHistory,
} from "../controllers/decision.controller";

const router = Router();

router.patch("/:decisionId/resolve", authMiddleware, resolveDecision);
router.get("/:decisionId/history", authMiddleware, getDecisionHistory);
export default router;
