import app from "./app.js";
import { env } from "./config/env.js";

if (env.jwtSecret.length < 32) {
  console.error("JWT_SECRET is missing or too short (need 32+ characters). See backend/.env.example.");
  process.exit(1);
}

const server = app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
