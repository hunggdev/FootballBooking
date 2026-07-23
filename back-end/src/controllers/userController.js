import { decode } from "jsonwebtoken";
import { prisma } from "../config/database.js";
import bcrypt from "bcrypt";

export const authMe = async (req, res) => {
    try {
        const user = req.user; // lay tu middleware
        return res.status(200).json({
            user
        })

        return res.status(200).json({message: "Success"});
    } catch (error) {
        console.log('Lỗi khi gọi authMe:', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const test = async (req, res) => {
    return res.sendStatus(204);
}

export const update = async (req, res) => {
    try {
        const {fullName, phone} = req.body;
        const userId = req.user.userId;
        const updatedUser = await prisma.user.update({
            where: {
                userId,
            },
            data: {
                fullName,
                phone,
            },
            select: {
                userId: true,
                fullName: true,
                phone: true,
                email: true,
                createdAt: true,
            }
        })
        return res.status(200).json({message: "Cập nhật thành công", user: updatedUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const changePassword = async (req, res) => {
    try {
        const {password, newPassword, confirmPassword} = req.body;
        const userId = req.user.userId;
        
        const user = await prisma.user.findUnique({
            where: {
                userId,
            },
        });
        
        if (!user) {
            return res.status(404).json({message: "Không tìm thấy user"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Mật khẩu không chính xác"});
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({message: "Mật khẩu mới và xác nhận mật khẩu không khớp"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
            where: {
                userId,
            },
            data: {
                passwordHash: hashedPassword,
            },
            select: {
                userId: true,
                fullName: true,
                phone: true,
                email: true,
                createdAt: true,
            }
        })
        return res.status(200).json({message: "Cập nhật thành công", user: updatedUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}


