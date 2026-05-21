import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const messagesTable = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectCode: text("project_code").notNull(),
  fromRole: text("from_role").notNull(), // "client" | "agency"
  text: text("text").notNull(),
  timeLabel: text("time_label").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true });
export const selectMessageSchema = createSelectSchema(messagesTable);

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
