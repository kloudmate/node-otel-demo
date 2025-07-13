import connectDB from "./lib/db";
import { authRouter } from "./routes/auth";
import { taskRouter } from "./routes/tasks";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { logger } from "./logger";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cors())
connectDB();

app.use("/api/v1", authRouter);
app.use("/api/v1/task", taskRouter);

app.listen(PORT, () => {
  logger.info(`Example app listening on port ${PORT}`);
});
