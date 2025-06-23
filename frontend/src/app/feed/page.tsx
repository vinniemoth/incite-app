"use client";
import Post from "@/components/post";
import Reactions from "@/components/reactions";
import { FaLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function Feed() {
  const router = useRouter();
  return (
    <div className="w-screen flex flex-col h-full">
      <Post></Post>
      <Reactions></Reactions>
      <FaLeftLong
        onClick={() => router.push("/home")}
        size={50}
        className="absolute top-5 left-5 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
      ></FaLeftLong>
    </div>
  );
}
