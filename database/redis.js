import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

//Docker
// const client = createClient({
//   socket: {
//     host: process.env.REDIS_HOST || "redis",
//     port: Number(process.env.REDIS_PORT) || 6379,
//   },
// });

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});


// Error handling
client.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis
await client.connect();

// Test function
export async function testRedis() {
  await client.set("test", "✅ Connected to Redis");
  const testData = await client.get("test");
  console.log(testData);
}

// Run test
testRedis();

export default client;
