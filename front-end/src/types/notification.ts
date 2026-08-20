import type { User } from "./user";


export interface Notification {
    notificationId: number;
    recipientId: number;
    actorId: number;
    type: string;
    title: string;
    message: string;
    entityType: string;
    entityId: number;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
    repicient: User;
    actor: User;
}
