"use client";
import PostInput from "@/components/postInput";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/");
    }
  }, []);
  return (
    <div className="w-screen flex flex-col h-full items-center py-5">
      <PostInput></PostInput>
    </div>
  );
}
