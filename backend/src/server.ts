import "dotenv/config";
import express from "express";
import { db } from "./db";
import { sql } from "drizzle-orm";

const PORT = Number(process.env.PORT);
const app = express();

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

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
