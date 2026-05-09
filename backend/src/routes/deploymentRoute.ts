import { Router } from "express";
import {
  createDeployment,
  getAllDeployments,
  getDeploymentById,
  getLogs,
  getLogStream,
} from "../services/deploymentService";

export const deploymentRouter = Router();

deploymentRouter.post("/", createDeployment);
deploymentRouter.get("/", getAllDeployments);
deploymentRouter.get("/:id", getDeploymentById);
deploymentRouter.get("/:id/logs", getLogs);
deploymentRouter.get("/:id/stream", getLogStream);
