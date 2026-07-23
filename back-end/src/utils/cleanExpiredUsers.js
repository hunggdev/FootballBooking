import { prisma } from '../config/database.js'; 

export const cleanExpiredUsers = async () => {
    try {
        const expiredTime = new Date(Date.now() - 1 * 60 * 1000); 

        const deletedUsers = await prisma.user.deleteMany({
            where: {
                status: "inactive",
                createdAt: {
                    lt: expiredTime
                }
            }
        });

        if (deletedUsers.count > 0) {
            console.log(`🧹 [Cron Job] Đã dọn dẹp ${deletedUsers.count} tài khoản chưa kích hoạt.`);
        }
    } catch (error) {
        console.error('❌ [Cron Job] Lỗi khi dọn dẹp user chưa kích hoạt:', error);
    }
};