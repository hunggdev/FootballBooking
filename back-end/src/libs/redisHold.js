import { redis } from "../config/redis.js";

const HOLD_TTL_SECONDS = 10 * 60; // 10 phút


const USER_HOLDS_PREFIX = "user-holds"; // Set: user-holds:{userId} -> [holdKey, ...]

export async function addUserHoldIndex(userId, holdKey) {
  await redis.sadd(`${USER_HOLDS_PREFIX}:${userId}`, holdKey);
}

export async function removeUserHoldIndex(userId, holdKey) {
  await redis.srem(`${USER_HOLDS_PREFIX}:${userId}`, holdKey);
}

// redis/holds.js
export async function getUserHolds(userId) {
  const indexKey = `${USER_HOLDS_PREFIX}:${userId}`;
  const holdKeys = await redis.smembers(indexKey);

  if (holdKeys.length === 0) return [];

  const pipeline = redis.pipeline();
  holdKeys.forEach((key) => {
    pipeline.get(key);
    pipeline.pttl(key);
  });
  const results = await pipeline.exec();

  const staleKeys = [];
  const holds = [];

  holdKeys.forEach((key, i) => {
    const value = results[i * 2][1];
    const pttl = results[i * 2 + 1][1];

    // Hold đã hết hạn/bị xoá nhưng index chưa được dọn -> loại bỏ lazy
    if (!value || pttl <= 0) {
      staleKeys.push(key);
      return;
    }
    
    const [, fieldId, slotId, bookingDate] = key.split(":");

    holds.push({
      fieldId,
      bookingDate,
      slotId: Number(slotId),
      userId: value,
      expiresAt: Date.now() + pttl,
      ttl: Math.ceil(pttl / 1000), // ✅ đổi ms -> giây
    });
  });

  if (staleKeys.length > 0) {
    await redis.srem(indexKey, ...staleKeys);
  }

  return holds.filter((h) => Number(h.userId) === Number(userId));
}

export const makeKey = (fieldId, slotId, bookingDate) =>
  `hold:${fieldId}:${slotId}:${bookingDate}`;

/**
 * Đặt hold cho slot (Atomic SET NX)
 */
export const setHold = async (fieldId, slotId, bookingDate, userId) => {
  const key = makeKey(fieldId, slotId, bookingDate);
  // EX (Expire): Thiết lập thời gian hết hạn (TTL) tính bằng giây (10 * 60 = 600s).
  // NX (Not Exists): Chỉ đặt key nếu key ĐƯỢC CHƯA TỒN TẠI.
  const result = await redis.set(key, String(userId), "EX", HOLD_TTL_SECONDS, "NX");
  return result === "OK";
};

/**
 * Lấy userId đang giữ slot
 */
export const getHold = async (fieldId, slotId, bookingDate) => {
  const key = makeKey(fieldId, slotId, bookingDate);
  return await redis.get(key);
};

/**
 * Lấy TTL còn lại (giây)
 */
export const getHoldTTL = async (fieldId, slotId, bookingDate) => {
  const key = makeKey(fieldId, slotId, bookingDate);
  return await redis.ttl(key);
};

/**
 * Xóa hold an toàn bằng Lua Script (Tránh race condition xóa nhầm key của người khác)
 */
export const deleteHold = async (fieldId, slotId, bookingDate, userId) => {
  const key = makeKey(fieldId, slotId, bookingDate);

  const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
    else
        return 0
    end
  `;

  const result = await redis.eval(luaScript, 1, key, String(userId));
  return result === 1;
};

/**
 * Lấy danh sách tất cả holds của một field trong ngày.
 * Tối ưu: Dùng SCAN tránh block Redis + Pipeline giảm RTT mạng.
 */
export const getFieldHolds = async (fieldId, bookingDate) => {
  const pattern = `hold:${fieldId}:*:${bookingDate}`;
  let cursor = "0";
  const keys = [];

  // 1. Quét tìm keys an toàn bằng SCAN thay vì KEYS
  do {
    const [nextCursor, matchedKeys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100
    );
    cursor = nextCursor;
    keys.push(...matchedKeys);
  } while (cursor !== "0");

  if (keys.length === 0) return [];

  // 2. Dùng Pipeline gom tất cả lệnh GET và TTL gửi trong 1 lượt duy nhất
  const pipeline = redis.pipeline();
  for (const key of keys) {
    pipeline.get(key);
    pipeline.ttl(key);
  }

  const responses = await pipeline.exec();
  const result = [];
  const now = Date.now();

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const userId = responses[i * 2][1];
    const ttl = responses[i * 2 + 1][1];

    if (userId && ttl > 0) {
      const parts = key.split(":");
      const slotId = Number(parts[2]);
      const expiresAt = new Date(now + ttl * 1000);

      result.push({ slotId, userId, ttl, expiresAt });
    }
  }

  return result;
};
