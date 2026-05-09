import { v4 as uuid } from "uuid";
import { db } from "../db";
import { deployments, logs } from "../db/schema";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { createDeploymentSchema } from "../validators/deployment";

export const createDeployment = async (req: Request, res: Response) => {
  const parsed = createDeploymentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: parsed.error.flatten(),
    });
  }

  const { name, source } = parsed.data;

  const id = uuid();

  const deployment = {
    id,
    name: name || "unnamed",
    source: source || "local",
    status: "queued",
    image_tag: null,
    container_id: null,
    url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await db.insert(deployments).values(deployment);

  await db.insert(logs).values({
    id: uuid(),
    deployment_id: id,
    message: "Deployment created (stub)",
    created_at: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: "Deployment Created",
    data: deployment,
  });
};

export const getAllDeployments = async (req: Request, res: Response) => {
  const all = await db.select().from(deployments);

  res.status(200).json({
    success: true,
    message: "Deployment Retrieved",
    data: all,
  });
};

export const getDeploymentById = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const result = await db
    .select()
    .from(deployments)
    .where(eq(deployments.id, id));

  if (!result[0]) {
    return res.status(404).json({ error: "Not found" });
  }

  res.status(200).json({
    success: true,
    message: "Deployment Retrieved",
    data: result[0],
  });
};

export const getLogs = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const result = await db.select().from(logs).where(eq(logs.deployment_id, id));

  res.status(200).json({
    success: true,
    message: "Logs gotten",
    data: result,
  });
};

export const getLogStream = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let count = 0;

  const interval = setInterval(() => {
    count++;

    res.write(
      `data: ${JSON.stringify({
        message: `fake log ${count}`,
        deployment_id: req.params.id,
      })}\n\n`,
    );

    if (count >= 10) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);
};
