"use client";
import { moduleApi } from "@/api/api";
import { useEffect, useState } from "react";

interface followProps {
  userId: string;
}

export default function FollowComponent({ userId }: followProps) {
  const [isFollower, setIsFollower] = useState<any>(false);

  const fetchFollow = async () => {
    const response = await moduleApi.fetchFollow(userId);
    const data = await response.json();
    console.log(data);
    setIsFollower(data);
    return data;
  };

  const setFollow = async () => {
    const response = await moduleApi.setFollow(isFollower, userId);
    console.log(isFollower);
    setIsFollower(!isFollower);
    return response;
  };

  useEffect(() => {
    fetchFollow();
  }, []);

  return (
    <>
      <div className="flex flex-row items-center my-5">
        <button
          className={`flex items-center justify-center w-full h-10  rounded-full transition-all duration-600 cursor-pointer hover:ring-1 hover:ring-purple-500 ${
            isFollower ? "bg-purple-500" : "bg-zinc-800"
          }`}
          onClick={setFollow}
        >
          {isFollower ? "Following" : "Follow"}
        </button>
      </div>
    </>
  );
}
