import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import dotenv from 'dotenv'

dotenv.config();

import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Kiểm tra biến môi trường
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing!");
}

// Tạo Pool PostgreSQL
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 50, // Cho phép tối đa 50 kết nối đồng thời trong 1 instance Node.js
    idleTimeoutMillis: 30000, // Tự động đóng kết nối nếu sau 30s không dùng
    connectionTimeoutMillis: 2000, // Nếu sau 2s không lấy được kết nối thì báo lỗi ngay (tránh treo app)
});

// Adapter Prisma
const adapter = new PrismaPg(pool);

// Khởi tạo Prisma Client
export const prisma = new PrismaClient({
    adapter,
});

// Hàm kết nối
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ PostgreSQL connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error(error);
        process.exit(1);
    }
};

// Hàm ngắt kết nối
export const disconnectDB = async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("🔌 Database disconnected.");
};