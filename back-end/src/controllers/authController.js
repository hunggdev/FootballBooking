import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

const ACCESS_TOKEN_TTL = "30s";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; 

export const signUp = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if(!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: "Tất cả các trường không được để trống" });
        }

    // kiểm tra email hoặc fullName đã tồn tại hay chưa
    const duplicate = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { fullName: fullName }
            ]
        }
    });

    if (duplicate) {
        return res.status(400).json({ message: "Email hoặc tên đã tồn tại" });
    }

    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    // tạo user mới (với status là inactive)
    const newUser = await prisma.user.create({
        data: {
            fullName,
            email,
            phone,
            passwordHash: hashedPassword,
            role: "user",
            status: "inactive"
        }
    });

    try {
        // tạo activation token
        const activationToken = jwt.sign(
            { email: newUser.email }, 
            process.env.ACTIVATION_TOKEN_SECRET, 
            { expiresIn: '15m' }
        );

        // tạo URL để xác minh
        const verificationUrl = `http://localhost:${process.env.PORT || 5001}/api/auth/verify?token=${activationToken}`;

        // gửi email
        const messageHtml = `
            <h2>Xin chào ${newUser.fullName},</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào link bên dưới để kích hoạt tài khoản của bạn (link có hiệu lực trong 15 phút):</p>
            <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Kích hoạt tài khoản</a>
            <br/><br/>
            <p>Hoặc copy link này dán vào trình duyệt: <br> <a href="${verificationUrl}">${verificationUrl}</a></p>
        `;

        await sendEmail({
            to: newUser.email,
            subject: 'Xác thực tài khoản của bạn',
            html: messageHtml
        });
    } catch (processError) {
        // xóa user nếu tạo token hoặc gửi email thất bại (rollback)
        try {
            await prisma.user.delete({ where: { userId: newUser.userId } });
        } catch (rollbackError) {
            console.error('Lỗi khi rollback user:', rollbackError);
        }
        console.error('Lỗi xử lý đăng ký, đã xóa user:', processError);
        return res.status(500).json({ 
            message: "Không thể gửi email xác thực. Vui lòng kiểm tra lại cấu hình EMAIL_USER và EMAIL_PASS trong file .env",
            errorDetail: processError.message
        });
    }

    // return   
    return res.status(201).json({ message: "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản." });

    } catch (error) {
        console.log('Lỗi khi gọi signUp',error);
        return res.status(500).json({ message: "Lỗi hệ thống"});
    }
};

export const signIn = async (req, res) => {
    try {
        // lay inputs
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Email và mật khẩu không được để trống" });
        }

        // lay hashedpasswordtrong db ve de so voi password input
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) {
            return res.status(401).json({ message: "Email hoặc password không chính xác" });
        }
        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if(!passwordCorrect) {
            return res.status(401).json({ message: "Email hoặc password không chính xác" });
        }

        // kiem tra trang thai kich hoat
        if(user.status !== "active") {
            return res.status(403).json({ message: "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt." });
        }
        // neu khop, tao accessToken voi jwt
        const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        
        // tao refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");
        
        // tao session moi de luu refresh token
        await prisma.session.create({
            data: {
                userId: user.userId,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
            }
        });
        // tra refresh token ve trong cookie
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // false ở localhost, true khi deploy
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: REFRESH_TOKEN_TTL,
        })
        
        // tra refresh token ve trong res 
        return res.status(200).json({ message: `User ${user.fullName} đã đăng nhập thành công` , accessToken });

    } catch (error) {
        console.error('Lỗi khi gọi signIn', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
        
    }
};

export const signOut = async (req, res) => {
    try {
        // lay refresh token tu cookie
        const token = req.cookies?.refreshToken;
        console.log("👉 Token nhận được từ Cookie là:", token);

        if(token) {
            // xoa refresh token tron Session
            try {
                await prisma.session.deleteMany({
                    where: { refreshToken: token }
                });
            } catch (dbError) {
                console.log('Session không tồn tại trong DB hoặc đã bị xóa trước đó.');
            }
            // xoa cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log('Lỗi khi gọi signOut', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Token không hợp lệ" });
        }

        // xac thuc token
        const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

        const user = await prisma.user.findUnique({ where: { email: decoded.email } });

        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" });
        }

        if (user.status === 'active') {
            return res.status(400).json({ message: "Tài khoản đã được kích hoạt trước đó" });
        }

        // cap nhat trang thai active
        await prisma.user.update({
            where: { email: decoded.email },
            data: { status: 'active' }
        });

        return res.status(200).json({ message: "Tài khoản đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập." });

    } catch (error) {
        console.error('Lỗi khi gọi verifyEmail:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Link kích hoạt đã hết hạn" });
        }
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if(!token){
            return res.status(401).json({ message: "Token không tồn tại" });
        }
        
        // so sánh với refresh token trong DB
        const session = await prisma.session.findFirst({
            where: {
                refreshToken: token 
            }
        })

        if(!session){
            return res.status(403).json({ message: "Không tìm thấy session, token không hợp lệ hoặc đã hết hạn" });
        }

        // kiểm tra đã hết hạn chưa
        if(session.expiresAt < new Date()){
            // xóa session hết hạn
            await prisma.session.delete({ where: { sessionId: session.sessionId } });
            return res.status(403).json({message: "Refresh token đã hết hạn. Vui lòng đăng nhập lại."})
        }

        // tạo access token mới
        const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // trả access token mới về cho client
        return res.status(200).json({ accessToken });

    } catch (error) {
        console.error("Lỗi khi gọi refreshToken",error);
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
}