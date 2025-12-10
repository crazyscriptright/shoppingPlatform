/**
 * Environment Configuration Loader for INS Lab
 * Automatically loads the appropriate .env file based on NODE_ENV
 */

import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

let isLoaded = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvironment({ force = false } = {}) {
  if (isLoaded && !force) {
    return;
  }

  isLoaded = true;
  const env = process.env.NODE_ENV;

  let envFile;

  switch (env) {
    case "production":
      envFile = ".env.production";
      break;
    default:
      envFile = ".env";
      break;
  }

  // Resolve to backend root directory (one level up from middleware)
  const envPath = path.resolve(__dirname, "..", envFile);

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(
      "❌ [INS_ENV_ERROR] Failed to load environment file:",
      result.error.message
    );
    // Fallback to default .env
    dotenv.config();
  }
}

export { loadEnvironment };
