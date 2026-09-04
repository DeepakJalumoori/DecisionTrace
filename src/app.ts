import express from "express";
import authRoutes from "./routes/auth.routes";
import teamRoutes from "./routes/team.routes";
import errorMiddleware from "./middleware/error.middleware";
import logger from "./middleware/logger.middleware";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Ok",
  });
});

app.use("/api/auth", logger, authRoutes);
app.use("/api/teams", logger, teamRoutes);
app.use(errorMiddleware);
export default app;
