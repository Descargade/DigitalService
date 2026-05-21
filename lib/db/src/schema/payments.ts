import { pgTable, text, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paymentsTable = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectCode: text("project_code").notNull(),
  label: text("label").notNull(),
  amount: integer("amount").notNull(),
  paid: boolean("paid").notNull().default(false),
  date: text("date").notNull(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true });
export const selectPaymentSchema = createSelectSchema(paymentsTable);

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
