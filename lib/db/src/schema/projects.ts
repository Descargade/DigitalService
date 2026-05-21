import { pgTable, text, integer, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  clientName: text("client_name").notNull(),
  clientInitials: text("client_initials").notNull(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(),
  startDate: text("start_date").notNull(),
  deliveryDate: text("delivery_date").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").notNull().default(0),
  currentStage: integer("current_stage").notNull().default(0),
  price: integer("price").notNull(),
  extras: jsonb("extras").$type<string[]>().notNull().default([]),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectProjectSchema = createSelectSchema(projectsTable);

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
