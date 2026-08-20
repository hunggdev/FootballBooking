import { prisma } from "../config/database.js";

export const createNotification = async ({
  recipientId,
  actorId,
  type,
  title,
  message,
  entityType,
  entityId,
}) => {
  const notification = await prisma.notification.create({
    data: {
      recipientId,
      actorId,
      type,
      title,
      message,
      entityType,
      entityId,
    },
  });

  return notification;
};
