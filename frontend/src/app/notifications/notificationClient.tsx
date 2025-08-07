"use client";

import { moduleApi } from "@/api/api";
import BackButton from "@/components/backButton";
import renderNotificationMessage from "@/utils/renderNotificationMessage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  type: string;
  data: any;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const fetched = await moduleApi.fetchNotifications();

      if (fetched.error) {
        console.error(fetched.error);
        return;
      }
      setNotifications(fetched.notifications ?? []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await moduleApi.markNotificationAsRead(id);
    setNotifications((prev) => {
      return prev.map((n) => {
        if (n.id === id) {
          return { ...n, isRead: true };
        }
        return n;
      });
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">You don't have any notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => {
            return (
              <li
                onClick={() => {
                  notification.type === "FOLLOW"
                    ? router.push(`/user/${notification.data.userName}`)
                    : router.push(`/post/${notification.data.postId}`);
                }}
                key={notification.id}
                className={`p-4 rounded shadow-sm border cursor-pointer text-zinc-50 ${
                  notification.isRead
                    ? "bg-purple-950 hover:bg-zinc-800 "
                    : "bg-purple-500 hover:bg-zinc-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p>{renderNotificationMessage(notification)}</p>
                  {!notification.isRead && (
                    <button
                      className="text-xs text-blue-600 underline"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <BackButton />
    </div>
  );
}
