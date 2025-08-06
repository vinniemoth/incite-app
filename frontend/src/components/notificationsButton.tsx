"use client";

import { moduleApi } from "@/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";

export default function NotificationsButton() {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const fetchNotifications = async () => {
    const data = await moduleApi.fetchNotifications();
    const notifications = Array.isArray(data) ? data : data.notifications;
    const unread = notifications.filter((n: any) => !n.isRead).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <FaBell
        onClick={() => router.push("/notifications")}
        size={50}
        className="absolute  top-5 right-5 bg-zinc-800 p-3 rounded-xl cursor-pointer hover:bg-zinc-700 z-50"
      />
      {unreadCount > 0 && (
        <span className="absolute z-100 top-4 right-4 text-xs bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
