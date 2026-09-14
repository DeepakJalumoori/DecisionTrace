import express from "express";
import authRoutes from "./routes/auth.routes";
import teamRoutes from "./routes/team.routes";
import errorMiddleware from "./middleware/error.middleware";
import logger from "./middleware/logger.middleware";
import transcriptRoutes from "./routes/transcript.routes";
import decisionRoutes from "./routes/decision.routes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Ok",
  });
});

app.use("/api/auth", logger, authRoutes);
app.use("/api/teams", logger, teamRoutes);
app.use("/api/teams/:teamId/transcripts", logger, transcriptRoutes);
app.use("/api/decisions", logger, decisionRoutes);
app.use(errorMiddleware);
export default app;
