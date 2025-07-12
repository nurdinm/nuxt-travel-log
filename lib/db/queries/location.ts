import type { InsertLocation } from "~/lib/db/schema";

import { location } from "~/lib/db/schema";

import db from "..";

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();
  return created;
}
