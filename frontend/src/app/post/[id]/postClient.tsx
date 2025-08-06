"use client";

import { moduleApi } from "@/api/api";
import BackButton from "@/components/backButton";
import NotificationsButton from "@/components/notificationsButton";
import Post from "@/components/post";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PostData {
  id: string;
  username: string;
  createdAt: string;
  coverImage: string | null;
  bookName: string;
  bookId: string;
  authorsName: string[];
  quote: string;
  owner: {
    id: string;
    username: string;
  };
  ownerId: string;
  onPostDeleted: (postId: string) => void;
}

export default function PostClient() {
  const [post, setPost] = useState<PostData>();
  const params = useParams();
  const postId = params.id as string;

  const handlePostDeleted = (postId: string) => {
    fetchPost();
  };

  const fetchPost = async () => {
    const response = await moduleApi.fetchSinglePost(postId);
    console.log(response);
    setPost(response);
    return response;
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {!post ? (
        <div className="flex flex-col justify-center items-center h-screen text-zinc-400 text-lg">
          <p>post not found.</p>
          <p className="text-zinc-500 text-sm mt-2">
            The post you are looking for does not exist.
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="sm:w-2/3 h-full flex justify-center items-center p-5">
            <Post
              id={post.id}
              username={post.owner.username}
              createdAt={formatDistanceToNow(post.createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
              coverImage={post.coverImage}
              bookName={post.bookName}
              bookId={post.bookId}
              authorsName={post.authorsName}
              quote={post.quote}
              ownerId={post.ownerId}
              onPostDeleted={handlePostDeleted}
            />
          </div>
        </div>
      )}
      <NotificationsButton></NotificationsButton>
      <BackButton />
    </div>
  );
}
