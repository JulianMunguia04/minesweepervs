import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

client.on("error", (err) => console.error("Redis Client Error", err));


await client.connect();

export async function testRedis(){
  await client.set("test", "✅ Connected to Redis")
  const testData = await client.get("test");
  console.log(testData);
}

testRedis()

export default client;