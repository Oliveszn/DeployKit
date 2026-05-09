import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const deployments = sqliteTable("deployments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull(),
  image_tag: text("image_tag"),
  container_id: text("container_id"),
  url: text("url"),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

export const logs = sqliteTable("logs", {
  id: text("id").primaryKey(),
  deployment_id: text("deployment_id").notNull(),
  message: text("message").notNull(),
  created_at: text("created_at").notNull(),
});
