import { prisma } from '../config/database.js'; 

export const cleanExpiredUsers = async () => {
    try {
        const expiredTime = new Date(Date.now() - 30 * 60 * 1000); 

        const deletedUsers = await prisma.user.deleteMany({
            where: {
                status: "INACTIVE",
                createdAt: {
                    lt: expiredTime
                }
            }
        });

        const deletedPRSToken = await prisma.passwordResetToken.deleteMany({
            where: {
                used: false,
                expiresAt: {
                    lt: expiredTime
                }
            }
        });

        if (deletedUsers.count > 0) {
            console.log(`🧹 [Cron Job] Đã dọn dẹp ${deletedUsers.count} tài khoản chưa kích hoạt.`);
        }
        
        if (deletedPRSToken.count > 0) {
            console.log(`🧹 [Cron Job] Đã dọn dẹp ${deletedPRSToken.count} password reset token không sử dụng.`);
        }
    } catch (error) {
        console.error('❌ [Cron Job] Lỗi khi dọn dẹp user chưa kích hoạt:', error);
    }
};