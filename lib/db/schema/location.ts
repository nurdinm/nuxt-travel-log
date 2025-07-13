import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "./auth";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const InsertLocation = createInsertSchema(location, {
  name: z.string("Name is required").max(100, "Name must not exceed 100 characters"),
  description: z.string().max(1000, "Description must not exceed 1000 characters").optional(),
  lat: z.coerce.number("Latitude must be a number").refine(value => value >= -90 && value <= 90, "Latitude is out of acceptable range"),
  long: z.coerce.number("Longitude must be a number").refine(value => value >= -90 && value <= 90, "Longitude is out of acceptable range"),
})
  .omit({
    id: true,
    slug: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertLocation = z.infer<typeof InsertLocation>;
