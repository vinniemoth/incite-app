import express from "express";

export default function setupNotificationRoutes(notificationService) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const userId = res.user_id;
    const { type, data } = req.body;

    try {
      const newNotification = await notificationService.createNotification(
        userId,
        type,
        data
      );
      res.status(201).json(newNotification);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/", async (req, res) => {
    const userId = res.user_id;
    try {
      const notifications = await notificationService.fetchNotifications(
        userId
      );
      res.status(200).json({ notifications });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = res.user_id;

    try {
      const notification = await notificationService.readNotification(
        id,
        userId
      );
      res.status(200).json({ notification });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error." });
    }
  });

  return router;
}
