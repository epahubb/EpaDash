import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";
import { readEnvironment } from "./config/env.js";
import { createS3ImageStorage } from "./modules/products/s3-image-storage.js";

const env = readEnvironment(process.env);
const db = new PrismaClient();
const storage = env.storage ? createS3ImageStorage(env.storage) : undefined;
const server = createApp(db, env.ACCESS_TOKEN_SECRET, storage).listen(env.PORT, () => {
  console.log(`EpaDash listening on port ${env.PORT}.`);
});

function shutdown() {
  server.close(async () => { await db.$disconnect(); });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
