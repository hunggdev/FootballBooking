import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6380,
  // password: process.env.REDIS_PASSWORD, // Bỏ comment nếu Redis có password
  lazyConnect: true, // Kết nối khi cần, không kết nối ngay khi import
});

redis.on("connect", () => {
  console.log("✅ Redis connected on port", process.env.REDIS_PORT || 6380);
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});
