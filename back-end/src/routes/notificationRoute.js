import express from "express"

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/",getNotifications);
router.get("/unread",getUnreadCount);
router.patch("/read/:notificationId",markAsRead);
router.patch("/read",markAllAsRead);

export default router;