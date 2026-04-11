import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./data-source";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 5000;


AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });