import express from "express";
import cors from "cors";
import shortenRouter from "./routes/shortenRouter";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware";
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1", shortenRouter)
app.get("/api/health", (_req, res) => {
  res.json({ message: "Server is running" });
});
app.use(errorHandlingMiddleware);
export default app;