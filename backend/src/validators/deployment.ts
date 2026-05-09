import { z } from "zod";

export const createDeploymentSchema = z.object({
  name: z.string().min(1).default("unnamed"),

  source: z
    .string()
    .url("Source must be a valid URL (e.g. https://github.com/user/repo)"),
});
