import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NOTE_CREATION_SERVER_URL: z.string().url(),
  },
  client: {},
  runtimeEnv: {
    NOTE_CREATION_SERVER_URL: process.env.NOTE_CREATION_SERVER_URL,
  },
});
