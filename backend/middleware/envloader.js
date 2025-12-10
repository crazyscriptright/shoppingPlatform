/**
 * Environment Configuration Loader for INS Lab
 * Automatically loads the appropriate .env file based on NODE_ENV
 */

import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvironment() {
  const env = process.env.NODE_ENV;

  console.log("🔧 [INS_ENV_LOADER] Loading environment:", env);

  let envFile;

  switch (env) {
    case "production":
      envFile = ".env.production";
      break;
    default:
      envFile = ".env";
      break;
  }

  const envPath = path.resolve(__dirname, envFile);
  console.log("🔧 [INS_ENV_LOADER] Loading env file:", envPath);

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(
      "❌ [INS_ENV_ERROR] Failed to load environment file:",
      result.error.message
    );
    // Fallback to default .env
    console.log("🔄 [INS_ENV_FALLBACK] Loading default .env file");
    dotenv.config();
  } else {
    console.log("✅ [INS_ENV_SUCCESS] Environment loaded successfully");
  }

  // Log current configuration (without sensitive data)
  console.log("🔧 [INS_ENV_CONFIG]", {
    environment: env,
    port: process.env.PORTINS,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasLabSecret: !!process.env.JWT_SECRET_LABS,
    mainServerUrl: process.env.MAIN_SERVER_URL,
    hasInsDbUrl: !!process.env.INS_DATABASE_URL,
    frontendUrl:
      env === "development"
        ? process.env.FRONTEND_URLDEV
        : process.env.FRONTEND_URL,
  });
}

export { loadEnvironment };
