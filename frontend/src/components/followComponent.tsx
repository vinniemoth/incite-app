"use client";
import { moduleApi } from "@/api/api";
import { useEffect, useState } from "react";

interface followProps {
  userId: string;
}

export default function FollowComponent({ userId }: followProps) {
  const [isFollower, setIsFollower] = useState(false);

  const fetchFollow = async () => {
    const response = await moduleApi.fetchFollow(userId);
    setIsFollower(response.following);
    return response;
  };

  const setFollow = async () => {
    const response = await moduleApi.setFollow(isFollower, userId);
    setIsFollower(response.following);
    return response;
  };

  useEffect(() => {
    fetchFollow();
  }, []);

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <div
          className=" flex items-center justify-center w-full h-10 bg-zinc-800 rounded-full  cursor-pointer hover:ring-1 hover:ring-purple-500"
          onClick={setFollow}
        >
          {isFollower ? "Following" : "Follow"}
        </div>
      </div>
    </>
  );
}
