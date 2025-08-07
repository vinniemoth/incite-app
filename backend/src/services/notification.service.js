class NotificationService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async createNotification(userId, type, data) {
    const existing = await this.dbClient.notification.findFirst({
      where: {
        userId,
        type,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existing && existing.data.actorId === data.actorId) {
      return await this.dbClient.notification.update({
        where: {
          id: existing.id,
        },
        data: {
          createdAt: new Date(),
          isRead: false,
        },
      });
    }
    const notification = await this.dbClient.notification.create({
      data: {
        userId,
        type,
        data,
      },
    });
    return notification;
  }

  async updateNotification({ actorId, postId, data }) {
    const existing = await this.dbClient.notification.findFirst({
      where: {
        userId: actorId,
        data: {
          path: ["postId"],
          equals: postId,
        },
      },
    });

    if (existing) {
      const notification = await this.dbClient.notification.update({
        where: {
          id: existing.id,
          type: "REACTED",
        },
        data: {
          createdAt: new Date(),
          isRead: false,
          data: {
            ...existing.data,
            type: data.type,
          },
        },
      });
      return notification;
    }
    return existing;
  }

  async deleteNotification({ userId, actorId, type, postId }) {
    const notifications = await this.dbClient.notification.findMany({
      where: {
        userId: actorId,
        type,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const match = notifications.find((notification) => {
      const json = notifications[0];
      if (!json) return false;
      if (json.type === "FOLLOW") {
        return json.data.followingId === actorId;
      }
      if (json.type === "REACTED") {
        return json.data.userId === userId && json.data.postId === postId;
      }
      return false;
    });
    if (match) {
      await this.dbClient.notification.delete({
        where: {
          id: match.id,
        },
      });
      return true;
    }
    return false;
  }

  async fetchNotifications(userId) {
    const notifications = await this.dbClient.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return notifications;
  }

  async readNotification(id) {
    const notification = await this.dbClient.notification.updateMany({
      where: { id },
      data: { isRead: true },
    });

    return notification;
  }
}

export default NotificationService;
