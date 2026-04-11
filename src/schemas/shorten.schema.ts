import { z } from "zod";

export const createShortenUrlSchema = z.object({
  originalUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "originalUrl is required"
          : "originalUrl must be a string",
    })
    .trim()
    .min(1, { error: "originalUrl cannot be empty" })
    .url({ error: "originalUrl must be a valid URL" })
    .max(2048, { error: "URL must not exceed 2048 characters" }),
});