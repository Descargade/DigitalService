import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const filesTable = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectCode: text("project_code").notNull(),
  name: text("name").notNull(),
  fileType: text("file_type").notNull(), // "image" | "document"
  size: text("size").notNull(),
  status: text("status").notNull(), // "received" | "pending"
  date: text("date").notNull(),
  fromRole: text("from_role").notNull(), // "client" | "agency"
  preview: text("preview"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFileSchema = createInsertSchema(filesTable).omit({ id: true, createdAt: true });
export const selectFileSchema = createSelectSchema(filesTable);

export type InsertFile = z.infer<typeof insertFileSchema>;
export type DBFile = typeof filesTable.$inferSelect;
