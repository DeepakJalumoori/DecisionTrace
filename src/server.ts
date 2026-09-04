import app from "./app";
import "dotenv/config";
import connectDB from "./config/db";

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`server running on ${port}`);
  });
};

startServer();
