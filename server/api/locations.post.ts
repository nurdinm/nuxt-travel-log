import type { DrizzleError } from "drizzle-orm";

import { customAlphabet } from "nanoid";
import slugify from "slug";

import { insertLocation } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);
export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);
  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  // Generate a unique slug by combining slugified name and current datetime in milliseconds
  const slug = slugify(`${result.data.name}-${nanoid()}-${Date.now()}`);
  try {
    return await insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Slug must be unique (the location name is used to generate the slug).",
      }));
    }
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.name, location.user_id") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "A location with this name already exists!",
      }));
    }
    throw error;
  }
});
