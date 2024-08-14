import dotenv from "dotenv";
import { bool, cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  IS_PRODUCTION: bool({ devDefault: testOnly(false) }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  OPENAI_API_KEY: str({ devDefault: testOnly("OPENAI_API_KEY") }),
  OPENAI_ORGANIZATION: str({ devDefault: testOnly("OPENAI_ORG") }),
  DB_HOST: str({ devDefault: testOnly("DB_HOST") }),
  DB_PORT: port({ devDefault: testOnly(3000) }),
  DB_USERNAME: str({ devDefault: testOnly("DB_USERNAME") }),
  DB_PASSWORD: str({ devDefault: testOnly("DB_PASSWORD") }),
  DB_NAME: str({ devDefault: testOnly("DB_NAME") }),
  DB_SSL_REJECT_UNAUTHORIZED: bool({ devDefault: testOnly(false) }),
  DB_SSL_CA: str({ devDefault: testOnly("DB_SSL_CA") }),
});
