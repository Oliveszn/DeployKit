import "dotenv/config";
import express from "express";
import { db } from "./db";
import { sql } from "drizzle-orm";
import "./db/migrate";
import { deploymentRouter } from "./routes/deploymentRoute";

const PORT = Number(process.env.PORT) || 8000;
const app = express();

app.use("/api/deployments", deploymentRouter);

app.get("/health", async (_, res) => {
  try {
    // simple database check
    await db.run(sql`SELECT 1`);

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at ${PORT}`);
});
